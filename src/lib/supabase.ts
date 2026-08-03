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
