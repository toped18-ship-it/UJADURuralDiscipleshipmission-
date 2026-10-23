import { AudioStore } from '../lib/audioStore';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  AdminStats,
  AudioTeaching,
  BlogPost,
  ContactMessage,
  GalleryItem,
  NewsletterSubscriber,
  SiteSettings,
} from '../types';

// INITIAL SEED DATA FOR LOCAL HYBRID FALLBACK MODE
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  ministry_name: 'UJADU RURAL DISCIPLESHIP MISSION',
  logo_text: 'UJADU MISSION',
  tagline: 'Making Disciples, Transforming Lives Through Christ',
  hero_headline: 'Making Disciples, Transforming Lives Through Christ',
  hero_subtext: 'Proclaiming the Gospel of Jesus Christ in unreached rural communities through active evangelism, grounded biblical teaching, discipleship training, and compassionate community outreach.',
  phone: '+234 806 645 6672',
  whatsapp: '+234 806 645 6672',
  email: 'info@ujadumission.org',
  location: 'Ujadu Mission Field Base, Rural Discipleship Center',
  mission_statement: 'To preach the uncompromised Gospel of Jesus Christ to rural populations, raise rooted disciples through systematic biblical instruction, and plant vibrant, self-sustaining local fellowship communities.',
  vision_statement: 'To see vibrant, Christ-centered rural communities transformed by the power of the Holy Spirit, where every believer is equipped as a faithful disciple-maker.',
  core_values: [
    'Biblical Supreme Authority',
    'Unwavering Christ-Centered Discipleship',
    'Sacrificial Rural Servant Leadership',
    'Holistic Community Transformation',
    'Faithful Stewardship & Integrity',
  ],
  footer_text: '© UJADU Rural Discipleship Mission. All rights reserved. Dedicated to rural evangelism, discipleship, and Christ-like community empowerment.',
  seo_title: 'UJADU Rural Discipleship Mission – Making Disciples Through Christ',
  seo_description: 'UJADU Rural Discipleship Mission is dedicated to rural evangelism, biblical discipleship, community spiritual transformation, downloadable audio teachings, and outreach.',
  social_facebook: 'https://facebook.com/ujadumission',
  social_youtube: 'https://youtube.com/ujadumission',
  social_whatsapp: 'https://wa.me/2348066456672',
};

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Rural Village Evangelism Outreach',
    description: 'Mission team gathering local families under the village shade tree for outdoor Gospel preaching and personal prayer in Ujadu rural district.',
    category: 'Evangelism',
    storage_path: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Village gathering under shade tree during Christian mission outreach',
    published: true,
    event_date: '2026-09-14',
    location: 'Ujadu East Village',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'gal-2',
    title: 'Community Bible Study & Fellowship',
    description: 'Believers meeting for systematic Bible study, group discussion, and discipleship mentoring in rural village setting.',
    category: 'Bible Study',
    storage_path: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Rural community group sitting together studying open Bibles',
    published: true,
    event_date: '2026-09-28',
    location: 'Discipleship Center',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Morning Rural Prayer Walk',
    description: 'Intercessory prayer warriors walking through farming settlements, interceding for revival, harvest, and community peace.',
    category: 'Prayer Meetings',
    storage_path: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Mission prayer team walking on rural dirt path at morning sunrise',
    published: true,
    event_date: '2026-10-05',
    location: 'North Farming Settlements',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'gal-4',
    title: 'Youth Discipleship & Skill Training',
    description: 'Equipping rural youth with biblical principles of integrity, leadership, and practical livelihood skills for community impact.',
    category: 'Discipleship',
    storage_path: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Young rural students engaged in discipleship workshop',
    published: true,
    event_date: '2026-10-12',
    location: 'Mission Training Hall',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'gal-5',
    title: 'Rural Gospel Crusade & Healing Service',
    description: 'Evening open-air revival meeting bringing salvation, hope, and freedom to remote village residents.',
    category: 'Mission Events',
    storage_path: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    alt_text: 'Evening open air revival meeting with village congregation',
    published: true,
    event_date: '2026-10-18',
    location: 'Central Market Grounds',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Sample public MP3 links with fallbacks
const SAMPLE_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const SAMPLE_AUDIO_URL_2 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

const DEFAULT_AUDIO: AudioTeaching[] = [
  {
    id: 'aud-1',
    title: 'The Great Commission in Rural Frontiers',
    speaker: 'Evangelist S. O. Okon',
    description: 'An inspiring exposition on Matthew 28:18-20, focusing on reaching neglected rural villages with the uncompromised power of the Gospel.',
    category: 'Sermon',
    scripture_reference: 'Matthew 28:18-20',
    audio_storage_path: SAMPLE_AUDIO_URL,
    cover_storage_path: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 2140, // 35m 40s
    published: true,
    published_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'aud-2',
    title: 'Foundations of Authentic Discipleship',
    speaker: 'Pastor Emmanuel David',
    description: 'Part 1 of the Rural Foundations Series: Understanding what it means to count the cost, deny self, and abide continuously in Christ.',
    category: 'Discipleship Series',
    scripture_reference: 'Luke 9:23-25, John 15:1-8',
    audio_storage_path: SAMPLE_AUDIO_URL_2,
    cover_storage_path: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 1820, // 30m 20s
    published: true,
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'aud-3',
    title: 'Prayer, Intercession & Village Spiritual Warfare',
    speaker: 'Minister Grace Adebayo',
    description: 'How simple, earnest village prayer altars break spiritual strongholds and prepare rural soil for Gospel awakening.',
    category: 'Prayer',
    scripture_reference: '2 Corinthians 10:3-5, Ephesians 6:10-18',
    audio_storage_path: SAMPLE_AUDIO_URL,
    cover_storage_path: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 2450, // 40m 50s
    published: true,
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'aud-4',
    title: 'Servant Leadership in Rural Church Planting',
    speaker: 'Evangelist S. O. Okon',
    description: 'Practical biblical guidance for pioneer missionaries, village pastors, and lay leaders serving remote congregations.',
    category: 'Leadership',
    scripture_reference: '1 Peter 5:1-4, Mark 10:42-45',
    audio_storage_path: SAMPLE_AUDIO_URL_2,
    cover_storage_path: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 2700, // 45m 00s
    published: true,
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Bringing Gospel Hope to Forgotten Rural Villages',
    slug: 'bringing-gospel-hope-to-forgotten-rural-villages',
    excerpt: 'Across remote settlements, many families live without access to systematic biblical discipleship. Here is how UJADU Mission is planting faith and hope.',
    content: `
### The Silent Harvest in Rural Communities

In many distant rural settlements, access to sound biblical teaching remains scarce. While urban centers often enjoy abundant ministry resources, small rural villages frequently face spiritual isolation, lack of trained teachers, and socio-economic hardship.

> "The harvest truly is plentiful, but the laborers are few. Therefore pray the Lord of the harvest to send out laborers into His harvest." — Matthew 9:37-38

#### Our Three-Fold Ministry Strategy

1. **Relational Outreach**: We enter communities by establishing genuine relationships with village leaders, listening to local needs, and demonstrating the compassionate love of Jesus Christ.
2. **Systematic Discipleship**: Rather than conducting one-off events, we establish weekly Bible study groups using localized study materials that emphasize personal repentance, salvation, and ongoing spiritual growth.
3. **Equipping Local Believers**: True transformation happens when local believers are mentored to become self-sustaining leaders, Sunday school teachers, and home fellowship hosts.

#### Testimonies of Transformation

During our recent outreach in the eastern farming hamlets, over forty villagers surrendered their lives to Christ. Today, a flourishing weekly fellowship gathers under a local mahogany tree, praying together and learning the scriptures faithfully.

We invite prayer partners and volunteers to stand with us as we expand into five additional target villages this coming season.
`,
    featured_image_path: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Evangelist S. O. Okon',
    category: 'Mission Reports',
    tags: ['Rural Evangelism', 'Gospel', 'Testimonies', 'Church Planting'],
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'blog-2',
    title: 'Walking in Biblical Holiness and Discipleship Daily',
    slug: 'walking-in-biblical-holiness-and-discipleship-daily',
    excerpt: 'True Christian discipleship is not merely an intellectual agreement with doctrine; it is a transformed daily walk shaped by the Holy Spirit and scripture.',
    content: `
### What Does It Mean to Follow Jesus Daily?

In Luke 9:23, Jesus gave a clear invitation: *"If anyone desires to come after Me, let him deny himself, and take up his cross daily, and follow Me."*

Discipleship in the rural context requires practical faithfulness. It means bringing kingdom values into farming, marketplace trading, family leadership, and community relationships.

#### Practical Pillars of Discipleship

- **Daily Scripture Abiding**: Spending unhurried time reading and meditating on God's Word.
- **Constant Intercessory Prayer**: Carrying fellow community members, leaders, and the unreached before the throne of grace.
- **Uncompromised Integrity**: Demonstrating honesty and truthfulness in every daily transaction.
- **Fellowship & Accountability**: Gathering regularly with fellow believers for encouragement, correction, and mutual care.

When a rural community observes believers living in authentic love and holiness, the Gospel shines with undeniable power.
`,
    featured_image_path: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Pastor Emmanuel David',
    category: 'Bible Teachings',
    tags: ['Discipleship', 'Holiness', 'Christian Living', 'Prayer'],
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'blog-3',
    title: 'Establishing Village Altars of Prayer and Intercession',
    slug: 'establishing-village-altars-of-prayer-and-intercession',
    excerpt: 'Before seeds of truth take root, the ground must be prepared through sustained, fervent intercession across rural territories.',
    content: `
### The Power of Intercessory Prayer in Rural Frontiers

In 2 Chronicles 7:14, God promises: *"If My people who are called by My name will humble themselves, and pray and seek My face, and turn from their wicked ways, then I will hear from heaven, and will forgive their sin and heal their land."*

Spiritual awakening in rural communities always begins with prayer. Our mission prioritizes setting up rural prayer watchtowers where intercessors meet at dawn to pray for their households, village leaders, and neighboring settlements.

#### How to Build an Effective Prayer Altar

1. **Unity in Spirit**: Gather believers with a single heart to seek God's presence.
2. **Scripture-Based Prayers**: Pray the promises of God found in His Word over your community.
3. **Persistent Intercession**: Do not grow weary; continue knocking and asking until breakthroughs manifest.

Join our monthly intercessory network as we intercede for rural revival across Africa.
`,
    featured_image_path: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Minister Grace Adebayo',
    category: 'Devotionals',
    tags: ['Prayer', 'Intercession', 'Revival', 'Faith'],
    status: 'published',
    published_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Brother Joseph K.',
    email: 'joseph.k@example.com',
    phone: '+234 802 999 1122',
    partnership_type: 'prayer',
    message: 'Grace to you! I would like to join the UJADU intercessory prayer network to support your rural village missions.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    read: false,
  },
];

// LOCAL STORAGE KEYS
const STORAGE_KEYS = {
  SETTINGS: 'ujadu_settings',
  GALLERY: 'ujadu_gallery',
  AUDIO: 'ujadu_audio',
  BLOGS: 'ujadu_blogs',
  MESSAGES: 'ujadu_messages',
  SUBSCRIBERS: 'ujadu_subscribers',
};

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'prayer.partner@example.com',
    subscribed_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    active: true,
  },
];

// HELPER FOR INITIALIZING STORAGE
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing to local storage key ${key}:`, err);
  }
}

// DATA SERVICE CLASS
export class DataService {
  // --- SITE SETTINGS ---
  static async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value');
        if (!error && data && data.length > 0) {
          const settingsObj: Partial<SiteSettings> = {};
          data.forEach((item) => {
            (settingsObj as Record<string, unknown>)[item.key] = item.value;
          });
          return { ...DEFAULT_SITE_SETTINGS, ...settingsObj };
        }
      } catch (err) {
        console.error('Supabase getSiteSettings error, falling back:', err);
      }
    }
    return getStoredItem<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  }

  static async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...settings };

    if (isSupabaseConfigured) {
      try {
        const updates = Object.entries(settings).map(([key, value]) => ({
          key,
          value,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
      } catch (err) {
        console.error('Supabase updateSiteSettings error:', err);
      }
    }

    setStoredItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- GALLERY IMAGES ---
  static async getGalleryImages(category?: string, includeUnpublished = false): Promise<GalleryItem[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
        if (!includeUnpublished) query = query.eq('published', true);
        if (category && category !== 'All') query = query.eq('category', category);
        const { data, error } = await query;
        if (!error && data) return data as GalleryItem[];
      } catch (err) {
        console.error('Supabase getGalleryImages error:', err);
      }
    }

    let items = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    if (!includeUnpublished) items = items.filter((i) => i.published);
    if (category && category !== 'All') items = items.filter((i) => i.category === category);
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async saveGalleryImage(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const now = new Date().toISOString();
    let savedItem: GalleryItem;

    if (item.id) {
      savedItem = {
        ...item,
        updated_at: now,
      } as GalleryItem;
    } else {
      savedItem = {
        id: `gal-${Date.now()}`,
        title: item.title || 'Untitled Image',
        description: item.description || '',
        category: item.category || 'Rural Outreach',
        storage_path: item.storage_path || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
        alt_text: item.alt_text || item.title || 'Ministry gallery image',
        published: item.published ?? true,
        event_date: item.event_date || new Date().toISOString().split('T')[0],
        location: item.location || 'Mission Field',
        created_at: now,
        updated_at: now,
      };
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_images').upsert(savedItem);
      } catch (err) {
        console.error('Supabase saveGalleryImage error:', err);
      }
    }

    const currentItems = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const existingIndex = currentItems.findIndex((i) => i.id === savedItem.id);
    if (existingIndex >= 0) {
      currentItems[existingIndex] = savedItem;
    } else {
      currentItems.unshift(savedItem);
    }
    setStoredItem(STORAGE_KEYS.GALLERY, currentItems);
    return savedItem;
  }

  static async deleteGalleryImage(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_images').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteGalleryImage error:', err);
      }
    }

    const currentItems = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const filtered = currentItems.filter((i) => i.id !== id);
    setStoredItem(STORAGE_KEYS.GALLERY, filtered);
    return true;
  }

  // --- FILE UPLOAD HELPERS ---
  // --- FILE UPLOAD HELPERS ---
  static async uploadAudioFile(file: File): Promise<{
    url: string;
    objectUrl: string;
    duration: number;
    fileName: string;
    fileSize: string;
    audioFileId: string;
  }> {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSizeStr = file.size >= 1024 * 1024 ? `${sizeInMB} MB` : `${Math.round(file.size / 1024)} KB`;

    // Calculate duration from audio metadata
    const getDuration = (f: File): Promise<number> => {
      return new Promise((resolve) => {
        try {
          const objectUrl = URL.createObjectURL(f);
          const tempAudio = new Audio();
          tempAudio.src = objectUrl;
          tempAudio.onloadedmetadata = () => {
            const dur = Math.round(tempAudio.duration);
            URL.revokeObjectURL(objectUrl);
            resolve(isNaN(dur) ? 1800 : dur);
          };
          tempAudio.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(1800);
          };
        } catch {
          resolve(1800);
        }
      });
    };

    const duration = await getDuration(file);

    // Save binary data to high-capacity client-side IndexedDB for unlimited local uploads
    const audioFileId = `aud-file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const { idbRef, objectUrl } = await AudioStore.saveAudioFile(audioFileId, file);

    // If Supabase Storage is configured, also attempt upload to audio-teachings bucket
    if (isSupabaseConfigured) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `sermons/${Date.now()}_${cleanName}`;
        const { error: uploadError } = await supabase.storage
          .from('audio-teachings')
          .upload(filePath, file, { contentType: file.type || 'audio/mpeg', upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('audio-teachings')
            .getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            return {
              url: publicUrlData.publicUrl,
              objectUrl,
              duration,
              fileName: file.name,
              fileSize: fileSizeStr,
              audioFileId,
            };
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload error, using local high-capacity storage:', err);
      }
    }

    return {
      url: idbRef,
      objectUrl,
      duration,
      fileName: file.name,
      fileSize: fileSizeStr,
      audioFileId,
    };
  }

  static async uploadImageFile(file: File, bucket = 'branding-assets'): Promise<string> {
    if (isSupabaseConfigured) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `covers/${Date.now()}_${cleanName}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { contentType: file.type || 'image/jpeg', upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Image upload fallback:', err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }

  // --- AUDIO TEACHINGS ---
  static async getAudioTeachings(category?: string, includeUnpublished = false): Promise<AudioTeaching[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('audio_teachings').select('*').order('published_at', { ascending: false });
        if (!includeUnpublished) query = query.eq('published', true);
        if (category && category !== 'All') query = query.eq('category', category);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as AudioTeaching[];
      } catch (err) {
        console.error('Supabase getAudioTeachings error:', err);
      }
    }

    const items = getStoredItem<AudioTeaching[]>(STORAGE_KEYS.AUDIO, DEFAULT_AUDIO);

    // Resolve any IndexedDB audio references to live playable/downloadable object URLs
    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        let storagePath = item.audio_storage_path;
        const fileId = item.audio_file_id || (storagePath?.startsWith('idb://') ? storagePath.replace('idb://', '') : null);
        if (fileId) {
          const liveUrl = await AudioStore.getAudioUrl(fileId);
          if (liveUrl) {
            storagePath = liveUrl;
          }
        }
        return {
          ...item,
          audio_storage_path: storagePath,
          cover_storage_path: item.cover_storage_path || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
        };
      })
    );

    let filtered = resolvedItems;
    if (!includeUnpublished) filtered = filtered.filter((i) => i.published);
    if (category && category !== 'All') filtered = filtered.filter((i) => i.category === category);
    return filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  static async getAudioById(id: string): Promise<AudioTeaching | null> {
    const list = await this.getAudioTeachings(undefined, true);
    return list.find((a) => a.id === id) || null;
  }

  static async saveAudioTeaching(item: Partial<AudioTeaching>): Promise<AudioTeaching> {
    const now = new Date().toISOString();

    // Ensure we keep the persistent idb:// reference in stored metadata rather than volatile blob: URL
    let persistentAudioPath = item.audio_storage_path || SAMPLE_AUDIO_URL;
    let fileId = item.audio_file_id;

    if (!fileId && persistentAudioPath.startsWith('idb://')) {
      fileId = persistentAudioPath.replace('idb://', '');
    }

    // If audio path is a blob URL from an uploaded file with an ID, keep the IDB reference for persistence
    if (fileId && (persistentAudioPath.startsWith('blob:') || (!persistentAudioPath.startsWith('idb://') && !persistentAudioPath.startsWith('http')))) {
      persistentAudioPath = `idb://${fileId}`;
    }

    let saved: AudioTeaching;

    if (item.id) {
      saved = {
        ...item,
        audio_file_id: fileId,
        audio_storage_path: persistentAudioPath,
        updated_at: now,
      } as AudioTeaching;
    } else {
      saved = {
        id: `aud-${Date.now()}`,
        title: item.title || 'Untitled Audio Teaching',
        speaker: item.speaker || 'UJADU Mission Preacher',
        description: item.description || '',
        category: item.category || 'Discipleship Series',
        scripture_reference: item.scripture_reference || '',
        audio_file_id: fileId,
        audio_storage_path: persistentAudioPath,
        cover_storage_path: item.cover_storage_path || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
        duration_seconds: item.duration_seconds || 1800,
        published: item.published ?? true,
        published_at: item.published_at || now,
        created_at: now,
        updated_at: now,
      };
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('audio_teachings').upsert(saved);
      } catch (err) {
        console.error('Supabase saveAudioTeaching error:', err);
      }
    }

    const current = getStoredItem<AudioTeaching[]>(STORAGE_KEYS.AUDIO, DEFAULT_AUDIO);
    const idx = current.findIndex((a) => a.id === saved.id);
    if (idx >= 0) {
      current[idx] = saved;
    } else {
      current.unshift(saved);
    }
    setStoredItem(STORAGE_KEYS.AUDIO, current);

    // If path is idb://, return with resolved live blob URL so the UI can play it immediately
    if (saved.audio_storage_path.startsWith('idb://')) {
      const liveId = saved.audio_storage_path.replace('idb://', '');
      const liveUrl = await AudioStore.getAudioUrl(liveId);
      if (liveUrl) {
        return { ...saved, audio_storage_path: liveUrl };
      }
    }

    return saved;
  }

  static async deleteAudioTeaching(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('audio_teachings').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteAudioTeaching error:', err);
      }
    }

    const current = getStoredItem<AudioTeaching[]>(STORAGE_KEYS.AUDIO, DEFAULT_AUDIO);
    const itemToDelete = current.find((a) => a.id === id);
    if (itemToDelete) {
      const fileId = itemToDelete.audio_file_id || (itemToDelete.audio_storage_path?.startsWith('idb://') ? itemToDelete.audio_storage_path.replace('idb://', '') : null);
      if (fileId) {
        await AudioStore.deleteAudioFile(fileId);
      }
    }
    const filtered = current.filter((a) => a.id !== id);
    setStoredItem(STORAGE_KEYS.AUDIO, filtered);
    return true;
  }

  // --- BLOG POSTS ---
  static async getBlogPosts(category?: string, includeDrafts = false): Promise<BlogPost[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (!includeDrafts) query = query.eq('status', 'published');
        if (category && category !== 'All') query = query.eq('category', category);
        const { data, error } = await query;
        if (!error && data) return data as BlogPost[];
      } catch (err) {
        console.error('Supabase getBlogPosts error:', err);
      }
    }

    let items = getStoredItem<BlogPost[]>(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
    if (!includeDrafts) items = items.filter((b) => b.status === 'published');
    if (category && category !== 'All') items = items.filter((b) => b.category === category);
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getBlogPostBySlug(slug: string, includeDrafts = false): Promise<BlogPost | null> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('blog_posts').select('*').eq('slug', slug);
        if (!includeDrafts) query = query.eq('status', 'published');
        const { data, error } = await query.single();
        if (!error && data) return data as BlogPost;
      } catch (err) {
        console.error('Supabase getBlogPostBySlug error:', err);
      }
    }

    const blogs = await this.getBlogPosts(undefined, includeDrafts);
    return blogs.find((b) => b.slug === slug) || null;
  }

  static async saveBlogPost(item: Partial<BlogPost>): Promise<BlogPost> {
    const now = new Date().toISOString();
    let saved: BlogPost;

    // Helper to generate slug
    const generateSlug = (title: string) =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    if (item.id) {
      saved = {
        ...item,
        slug: item.slug || (item.title ? generateSlug(item.title) : `post-${Date.now()}`),
        updated_at: now,
      } as BlogPost;
    } else {
      const slug = item.slug || (item.title ? generateSlug(item.title) : `post-${Date.now()}`);
      saved = {
        id: `blog-${Date.now()}`,
        title: item.title || 'Untitled Blog Post',
        slug,
        excerpt: item.excerpt || 'Brief excerpt describing this blog article...',
        content: item.content || 'Content for this blog post goes here...',
        featured_image_path: item.featured_image_path || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
        author_name: item.author_name || 'UJADU Discipleship Team',
        category: item.category || 'Discipleship',
        tags: item.tags || ['Discipleship', 'Evangelism'],
        status: item.status || 'draft',
        published_at: item.status === 'published' ? (item.published_at || now) : undefined,
        created_at: now,
        updated_at: now,
      };
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('blog_posts').upsert(saved);
      } catch (err) {
        console.error('Supabase saveBlogPost error:', err);
      }
    }

    const current = getStoredItem<BlogPost[]>(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
    const idx = current.findIndex((b) => b.id === saved.id);
    if (idx >= 0) {
      current[idx] = saved;
    } else {
      current.unshift(saved);
    }
    setStoredItem(STORAGE_KEYS.BLOGS, current);
    return saved;
  }

  static async deleteBlogPost(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('blog_posts').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteBlogPost error:', err);
      }
    }

    const current = getStoredItem<BlogPost[]>(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
    const filtered = current.filter((b) => b.id !== id);
    setStoredItem(STORAGE_KEYS.BLOGS, filtered);
    return true;
  }

  // --- MESSAGES & PARTNERSHIP INQUIRIES ---
  static async sendContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      read: false,
    };

    const current = getStoredItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    current.unshift(newMessage);
    setStoredItem(STORAGE_KEYS.MESSAGES, current);
    return newMessage;
  }

  static async getMessages(): Promise<ContactMessage[]> {
    return getStoredItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  }

  static async markMessageRead(id: string): Promise<void> {
    const messages = await this.getMessages();
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    setStoredItem(STORAGE_KEYS.MESSAGES, updated);
  }

  // --- NEWSLETTER SUBSCRIBERS ---
  static async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('subscribers').insert({ email: trimmedEmail });
        if (error) {
          if (error.code === '23505') {
            return { success: true, message: 'You are already subscribed to the UJADU Ministry newsletter!' };
          }
          console.error('Supabase subscriber error:', error);
        } else {
          return { success: true, message: 'Thank you for subscribing to UJADU Rural Discipleship updates!' };
        }
      } catch (err) {
        console.error('Supabase subscriber exception:', err);
      }
    }

    // Local Storage Fallback
    const subscribers = getStoredItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
    const existing = subscribers.find((s) => s.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: true, message: 'You are already subscribed to the UJADU Ministry newsletter!' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmedEmail,
      subscribed_at: new Date().toISOString(),
      active: true,
    };
    subscribers.unshift(newSub);
    setStoredItem(STORAGE_KEYS.SUBSCRIBERS, subscribers);
    return { success: true, message: 'Thank you for subscribing to UJADU Rural Discipleship updates!' };
  }

  static async getSubscribers(): Promise<NewsletterSubscriber[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false });
        if (!error && data) return data as NewsletterSubscriber[];
      } catch (err) {
        console.error('Supabase getSubscribers error:', err);
      }
    }
    return getStoredItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
  }

  static async deleteSubscriber(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('subscribers').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteSubscriber error:', err);
      }
    }

    const current = getStoredItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
    const filtered = current.filter((s) => s.id !== id);
    setStoredItem(STORAGE_KEYS.SUBSCRIBERS, filtered);
    return true;
  }

  // --- ADMIN DASHBOARD STATS ---
  static async getAdminStats(): Promise<AdminStats> {
    const allBlogs = await this.getBlogPosts(undefined, true);
    const allGallery = await this.getGalleryImages(undefined, true);
    const allAudio = await this.getAudioTeachings(undefined, true);
    const messages = await this.getMessages();
    const subscribers = await this.getSubscribers();

    return {
      publishedBlogs: allBlogs.filter((b) => b.status === 'published').length,
      draftBlogs: allBlogs.filter((b) => b.status === 'draft').length,
      publishedGallery: allGallery.filter((g) => g.published).length,
      publishedAudio: allAudio.filter((a) => a.published).length,
      totalMessages: messages.length,
      totalSubscribers: subscribers.length,
    };
  }
}
