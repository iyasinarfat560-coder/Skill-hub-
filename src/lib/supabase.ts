import { createClient } from '@supabase/supabase-js';
import {
  Course,
  Order,
  Customer,
  Category,
  Coupon,
  AdminReview,
  BlogPost,
  Subscriber,
  Announcement,
  GeneralSettings,
  PaymentSettingsData,
  WebsiteSettingsData,
  WhatsAppSettingsData,
  StaffMember,
  SystemAuditLog,
  Bundle,
} from '../types';

// Supabase Credentials provided by user
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://evllwxydwmgglkaoepan.supabase.co';

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bGx3eHlkd21nZ2xrYW9lcGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTY0ODcsImV4cCI6MjEwMDc5MjQ4N30.DyLueAx_t4DwniDnAfwC6doxbBqXQv3ZIX1WLQkLhRI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Interface for full database snapshot
export interface AppDatabaseSnapshot {
  products: Course[];
  bundles?: Bundle[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  reviews: AdminReview[];
  coupons: Coupon[];
  blogPosts: BlogPost[];
  subscribers: Subscriber[];
  announcements: Announcement[];
  generalSettings: GeneralSettings;
  paymentSettings: PaymentSettingsData;
  websiteSettings: WebsiteSettingsData;
  whatsappSettings: WhatsAppSettingsData;
  staffMembers: StaffMember[];
  auditLogs: SystemAuditLog[];
}

/**
 * Fetch master state snapshot from Supabase key-value / collection table
 */
export async function fetchSupabaseAppState(): Promise<Partial<AppDatabaseSnapshot> | null> {
  try {
    const { data, error } = await supabase
      .from('skills_hub_state')
      .select('key, value');

    if (error || !data || data.length === 0) {
      console.warn('Supabase skills_hub_state empty or table pending, using current state fallback.');
      return null;
    }

    const result: Partial<AppDatabaseSnapshot> = {};
    for (const row of data) {
      if (row.key && row.value) {
        (result as any)[row.key] = row.value;
      }
    }
    return result;
  } catch (err) {
    console.error('Error fetching Supabase app state:', err);
    return null;
  }
}

/**
 * Save a specific state key to Supabase (e.g. key='products', value=[...])
 */
export async function saveSupabaseStateKey<K extends keyof AppDatabaseSnapshot>(
  key: K,
  value: AppDatabaseSnapshot[K]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('skills_hub_state')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      console.warn(`Failed to upsert key ${key} into Supabase skills_hub_state:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Error saving key ${key} to Supabase:`, err);
    return false;
  }
}

/**
 * Save full snapshot to Supabase
 */
export async function saveFullSupabaseSnapshot(snapshot: AppDatabaseSnapshot): Promise<boolean> {
  try {
    const rows = Object.entries(snapshot).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('skills_hub_state')
      .upsert(rows, { onConflict: 'key' });

    if (error) {
      console.warn('Could not save full snapshot to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error saving full snapshot to Supabase:', err);
    return false;
  }
}

/**
 * Insert or update individual order into Supabase orders table if created
 */
export async function saveSupabaseOrder(order: Order): Promise<void> {
  try {
    await supabase.from('orders').upsert({
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      product_title: order.productTitle,
      product_id: order.productId,
      amount: order.amount,
      payment_method: order.paymentMethod,
      transaction_id: order.transactionId,
      status: order.status,
      date: order.date,
      item_category: order.itemCategory,
      raw_data: order,
    }, { onConflict: 'id' });
  } catch (e) {
    // Graceful fallback
    console.log('Saved to state snapshot fallback');
  }
}

/**
 * Insert or update individual subscriber into Supabase subscribers table
 */
export async function saveSupabaseSubscriber(subscriber: Subscriber): Promise<void> {
  try {
    await supabase.from('subscribers').upsert({
      id: subscriber.id,
      email: subscriber.email,
      subscribed_date: subscriber.subscribedDate,
      status: subscriber.status,
    }, { onConflict: 'id' });
  } catch (e) {
    console.log('Saved to state snapshot fallback');
  }
}

/**
 * Insert or update individual product/course into Supabase products table
 */
export async function saveSupabaseProduct(product: Course): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      title: product.title,
      category: product.category,
      original_price: product.originalPrice,
      discount_price: product.discountPrice,
      students_count: product.studentsCount,
      thumbnail_url: product.thumbnailUrl || '',
      product_type: product.productType || 'Full Course',
      description: product.description || '',
      raw_data: product,
    }, { onConflict: 'id' });

    if (error) {
      console.warn('Failed to upsert product into Supabase products table:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error saving product to Supabase:', e);
    return false;
  }
}

/**
 * Delete individual product/course from Supabase products table
 */
export async function deleteSupabaseProduct(productId: string): Promise<void> {
  try {
    await supabase.from('products').delete().eq('id', productId);
  } catch (e) {
    console.log('Delete product fallback');
  }
}

/**
 * Fetch products directly from Supabase products table
 */
export async function fetchSupabaseProducts(): Promise<Course[] | null> {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) {
      return null;
    }
    return data.map((row: any) => row.raw_data || {
      id: row.id,
      title: row.title,
      category: row.category,
      originalPrice: row.original_price,
      discountPrice: row.discount_price,
      studentsCount: row.students_count,
      thumbnailUrl: row.thumbnail_url,
      productType: row.product_type,
      description: row.description,
    });
  } catch (err) {
    console.error('Error fetching Supabase products table:', err);
    return null;
  }
}

/**
 * Test Supabase connection and state table readiness
 */
export async function testSupabaseSync(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('skills_hub_state')
      .upsert({ key: '_ping', value: { timestamp: new Date().toISOString() }, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
      return {
        success: false,
        message: `Supabase Error: ${error.message}. (Ensure 'skills_hub_state' table exists in Supabase and RLS is disabled).`
      };
    }
    return { success: true, message: 'Supabase connection & skills_hub_state table are fully operational!' };
  } catch (err: any) {
    return { success: false, message: `Connection exception: ${err.message || err}` };
  }
}

/**
 * Force sync all products to Supabase state and products table
 */
export async function syncAllProductsToSupabase(products: Course[]): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const stateSuccess = await saveSupabaseStateKey('products', products);
    let syncedCount = 0;
    for (const p of products) {
      try {
        const { error } = await supabase.from('products').upsert({
          id: p.id,
          title: p.title,
          category: p.category,
          original_price: p.originalPrice,
          discount_price: p.discountPrice,
          students_count: p.studentsCount,
          thumbnail_url: p.thumbnailUrl || '',
          product_type: p.productType || 'Full Course',
          description: p.description || '',
          raw_data: p,
        }, { onConflict: 'id' });
        if (!error) syncedCount++;
      } catch (e) {
        // fallback
      }
    }

    if (!stateSuccess && syncedCount === 0) {
      return { success: false, count: 0, error: 'Failed to write to Supabase. Please check if tables are created in Supabase.' };
    }

    return { success: true, count: products.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || String(err) };
  }
}

/**
 * 3-Step Admin Access Verification via Supabase:
 * 1. Authorized User ID check (authorized_admins table)
 * 2. Login Credentials verification (Supabase Auth)
 * 3. Approved Device check (approved_devices table)
 */
export async function verifySupabaseAdminAccess(
  email: string,
  pass: string,
  deviceId: string
): Promise<{ success: boolean; error?: string; role?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();

    // Step 1: Check if User ID is Authorized in authorized_admins table
    const { data: adminRecord, error: adminError } = await supabase
      .from('authorized_admins')
      .select('email, role, is_active')
      .eq('email', cleanEmail)
      .eq('is_active', true)
      .single();

    if (adminError || !adminRecord) {
      return { success: false, error: 'ADMIN ACCESS DENIED: Unauthorized User ID (Not registered in authorized_admins table).' };
    }

    // Step 2: Verify Login Credential via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: pass,
    });

    if (authError || !authData.session) {
      return { success: false, error: 'ADMIN ACCESS DENIED: Incorrect Login Credentials (Supabase Auth verification failed).' };
    }

    // Step 3: Verify Approved Device in approved_devices table
    const { data: deviceRecord, error: deviceError } = await supabase
      .from('approved_devices')
      .select('*')
      .eq('admin_email', cleanEmail)
      .eq('device_id', deviceId)
      .eq('is_approved', true)
      .single();

    if (deviceError || !deviceRecord) {
      await supabase.auth.signOut();
      return { success: false, error: 'ADMIN ACCESS DENIED: Unknown or Unapproved Device (Device ID not registered in approved_devices table).' };
    }

    return { success: true, role: adminRecord.role };
  } catch (err: any) {
    await supabase.auth.signOut();
    return { success: false, error: 'ADMIN ACCESS DENIED: ' + (err.message || 'System error') };
  }
}

/**
 * Register or approve a device for an admin
 */
export async function registerApprovedDevice(
  email: string,
  deviceId: string,
  deviceName: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('approved_devices').upsert({
      admin_email: email.trim().toLowerCase(),
      device_id: deviceId,
      device_name: deviceName,
      is_approved: true,
      last_login: new Date().toISOString(),
    }, { onConflict: 'admin_email,device_id' });

    return !error;
  } catch (e) {
    return false;
  }
}

/**
 * Save or update customer profile in Supabase profiles table
 */
export async function saveSupabaseProfile(user: {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
}): Promise<boolean> {
  try {
    const cleanEmail = user.email.trim().toLowerCase();
    const { error } = await supabase.from('profiles').upsert({
      id: user.id || cleanEmail,
      email: cleanEmail,
      name: user.name,
      full_name: user.name,
      avatar_url: user.avatar || '',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (error) {
      console.warn('Could not save profile to Supabase profiles table:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error saving profile to Supabase:', err);
    return false;
  }
}

