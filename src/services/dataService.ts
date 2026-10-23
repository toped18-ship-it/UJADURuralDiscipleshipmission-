import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { AudioStore } from '../lib/audioStore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { AudioTeaching, BlogPost, ContactMessage, CustomPage, GalleryItem, NewsletterSubscriber, SiteSettings, AdminStats, AboutContent } from '../types';
import { sanitizeForFirestore, sanitizeSlides } from '../utils/slideHelper';

// FIRESTORE ERROR HANDLING IN ACCORDANCE WITH FIREBASE INTEGRATION SKILL
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// INITIAL SEED DATA FOR CLOUD BOOTSTRAP & OFFLINE RESILIENCE
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  ministry_name: 'UJADU RURAL DISCIPLESHIP MISSION',
  logo_text: 'UJADU MISSION',
  tagline: 'Making Disciples, Transforming Lives Through Christ',
  hero_headline: 'Making Disciples, Transforming Lives Through Christ',
  hero_subtext:
    'Proclaiming the Gospel of Jesus Christ in unreached rural communities through active evangelism, grounded biblical teaching, discipleship training, and compassionate community outreach.',
  phone: '+234 806 645 6672',
  whatsapp: '+234 806 645 6672',
  email: 'info@ujadumission.org',
  location: 'Ujadu Mission Field Base, Rural Discipleship Center',
  mission_statement:
    'To preach the uncompromised Gospel of Jesus Christ to rural populations, raise rooted disciples through systematic biblical instruction, and plant vibrant, self-sustaining local fellowship communities.',
  vision_statement:
    'To see vibrant, Christ-centered rural communities transformed by the power of the Holy Spirit, where every believer is equipped as a faithful disciple-maker.',
  core_values: [
    'Biblical Supreme Authority',
    'Unwavering Christ-Centered Discipleship',
    'Sacrificial Rural Servant Leadership',
    'Holistic Community Transformation',
    'Faithful Stewardship & Integrity',
  ],
  footer_text:
    '© UJADU Rural Discipleship Mission. All rights reserved. Dedicated to rural evangelism, discipleship, and Christ-like community empowerment.',
  seo_title: 'UJADU Rural Discipleship Mission – Making Disciples Through Christ',
  seo_description:
    'UJADU Rural Discipleship Mission is dedicated to rural evangelism, biblical discipleship, community spiritual transformation, downloadable audio teachings, and outreach.',
  social_facebook: 'https://facebook.com/ujadumission',
  social_youtube: 'https://youtube.com/ujadumission',
  social_whatsapp: 'https://wa.me/2348066456672',
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero_badge: 'Who We Are',
  hero_title: 'About UJADU Rural Discipleship Mission',
  hero_tagline: 'Making Disciples, Transforming Lives Through Christ in rural communities.',

  overview_badge: 'Ministry Overview',
  overview_title: 'A Calling to Unreached Rural Frontiers',
  overview_paragraph_1:
    'UJADU Rural Discipleship Mission was established out of a deep burden for rural populations in underserved villages and agricultural settlements. While urban centers often enjoy vibrant church networks, rural communities frequently lack trained ministers, study Bibles, and systematic discipleship programs.',
  overview_paragraph_2:
    'Our conviction is grounded in the conviction that every human soul in the most distant hamlet is precious to God. We combine direct, compassionate Gospel proclamation with long-term, grounding discipleship that equips local believers to become pillar leaders in their families and communities.',
  overview_image:
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=80',
  overview_image_alt: 'Rural African village gathering listening to gospel',

  mission_title: 'Our Mission',
  mission_statement:
    'To preach the uncompromised Gospel of Jesus Christ to rural populations, raise rooted disciples through systematic biblical instruction, and plant vibrant, self-sustaining local fellowship communities.',
  vision_title: 'Our Vision',
  vision_statement:
    'To see vibrant, Christ-centered rural communities transformed by the power of the Holy Spirit, where every believer is equipped as a faithful disciple-maker.',

  pillars_badge: 'Guiding Pillars',
  pillars_title: 'Core Biblical Values',
  pillars_subtext: 'The principles that anchor our field decisions, teaching curricula, and community engagement.',
  pillars: [
    {
      id: 'pil-1',
      title: 'Biblical Supreme Authority',
      scripture_reference: '2 Timothy 3:16-17',
      description: 'Anchored on Holy Scripture as our sole authority for life, salvation, and ministry practice.',
    },
    {
      id: 'pil-2',
      title: 'Unwavering Christ-Centered Discipleship',
      scripture_reference: 'Matthew 28:19-20',
      description: 'Nurturing believers to spiritual maturity through systematic personal study and life-on-life mentoring.',
    },
    {
      id: 'pil-3',
      title: 'Sacrificial Rural Servant Leadership',
      scripture_reference: 'Mark 10:45',
      description: 'Living alongside village communities with humble hearts, serving their spiritual and holistic needs.',
    },
    {
      id: 'pil-4',
      title: 'Holistic Community Transformation',
      scripture_reference: 'James 2:15-17',
      description: 'Reflecting the compassion of Christ through practical community blessing, relief, and empowerment.',
    },
    {
      id: 'pil-5',
      title: 'Faithful Stewardship & Integrity',
      scripture_reference: '1 Corinthians 4:2',
      description: 'Honoring God with unwavering accountability in all resources, missionary time, and relationships.',
    },
  ],

  strategy_badge: 'Our Strategy',
  strategy_title: 'Our 4-Phase Rural Discipleship Cycle',
  strategy_phases: [
    {
      id: 'ph-1',
      step_number: 1,
      title: 'Frontier Outreach',
      description: 'Conducting village door-to-door evangelism, film shows, and open-air gospel meetings in unreached areas.',
    },
    {
      id: 'ph-2',
      step_number: 2,
      title: 'Grounding Believers',
      description: 'Establishing weekly Bible study circles covering foundational doctrines, salvation, assurance, and prayer.',
    },
    {
      id: 'ph-3',
      step_number: 3,
      title: 'Leadership Mentorship',
      description: 'Training local elders, women leaders, and youth directors to lead prayer watches and study classes.',
    },
    {
      id: 'ph-4',
      step_number: 4,
      title: 'Community Blessing',
      description: 'Integrating clean water initiatives, health education, and agricultural support to reflect God\'s love.',
    },
  ],

  leadership_badge: 'Servant Leadership',
  leadership_title: 'Ministry Leadership & Field Team',
  leadership_subtext: 'Dedicated servants laboring across rural field bases.',
  leadership_team: [
    {
      id: 'lead-1',
      name: 'Evangelist S. O. Okon',
      role: 'Mission Director & Pioneer Evangelist',
      bio: 'Over 20 years of dedicated rural field evangelism, church planting, and missionary training across underserved communities.',
      initials: 'EO',
      photo_url: '',
    },
    {
      id: 'lead-2',
      name: 'Pastor Emmanuel David',
      role: 'Head of Discipleship & Curriculum',
      bio: 'Passionate teacher of scripture focused on localized discipleship materials and training indigenous lay leaders.',
      initials: 'ED',
      photo_url: '',
    },
    {
      id: 'lead-3',
      name: 'Minister Grace Adebayo',
      role: 'Intercession & Women Discipleship',
      bio: 'Directing rural women’s prayer fellowships, community welfare initiatives, and youth mentoring.',
      initials: 'GA',
      photo_url: '',
    },
  ],

  milestones_title: 'Field Milestones & Kingdom Impact',
  milestones: [
    { id: 'ms-1', value: '85+', label: 'Rural Villages Reached' },
    { id: 'ms-2', value: '1,400+', label: 'Disciples Grounded' },
    { id: 'ms-3', value: '3,200+', label: 'Study Bibles Distributed' },
    { id: 'ms-4', value: '24', label: 'Local Fellowships Planted' },
  ],

  cta_heading: 'Ready to Walk with Us?',
  cta_primary_label: 'Get Involved & Partner',
  cta_primary_link: '/contact',
  cta_secondary_label: 'Listen to Teachings',
  cta_secondary_link: '/audio',
};

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Rural Village Evangelism Outreach',
    description:
      'Mission team gathering local families under the village shade tree for outdoor Gospel preaching and personal prayer in Ujadu rural district.',
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
    description:
      'Believers meeting for systematic Bible study, group discussion, and discipleship mentoring in rural village setting.',
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
    description:
      'Intercessory prayer warriors walking through farming settlements, interceding for revival, harvest, and community peace.',
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
    description:
      'Equipping rural youth with biblical principles of integrity, leadership, and practical livelihood skills for community impact.',
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
    description:
      'Evening open-air revival meeting bringing salvation, hope, and freedom to remote village residents.',
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

const SAMPLE_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const SAMPLE_AUDIO_URL_2 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

const DEFAULT_AUDIO: AudioTeaching[] = [
  {
    id: 'aud-1',
    title: 'The Great Commission in Rural Frontiers',
    speaker: 'Evangelist S. O. Okon',
    description:
      'An inspiring exposition on Matthew 28:18-20, focusing on reaching neglected rural villages with the uncompromised power of the Gospel.',
    category: 'Sermon',
    scripture_reference: 'Matthew 28:18-20',
    audio_storage_path: SAMPLE_AUDIO_URL,
    cover_storage_path: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 2140,
    published: true,
    published_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'aud-2',
    title: 'Foundations of Authentic Discipleship',
    speaker: 'Pastor Emmanuel David',
    description:
      'Part 1 of the Rural Foundations Series: Understanding what it means to count the cost, deny self, and abide continuously in Christ.',
    category: 'Discipleship Series',
    scripture_reference: 'Luke 9:23-25, John 15:1-8',
    audio_storage_path: SAMPLE_AUDIO_URL_2,
    cover_storage_path: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 1820,
    published: true,
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'aud-3',
    title: 'Prayer, Intercession & Village Spiritual Warfare',
    speaker: 'Minister Grace Adebayo',
    description:
      'How simple, earnest village prayer altars break spiritual strongholds and prepare rural soil for Gospel awakening.',
    category: 'Prayer',
    scripture_reference: '2 Corinthians 10:3-5, Ephesians 6:10-18',
    audio_storage_path: SAMPLE_AUDIO_URL,
    cover_storage_path: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 2450,
    published: true,
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'aud-4',
    title: 'Servant Leadership in Rural Church Planting',
    speaker: 'Evangelist S. O. Okon',
    description:
      'Practical biblical guidance for pioneer missionaries, village pastors, and lay leaders serving remote congregations.',
    category: 'Leadership',
    scripture_reference: '1 Peter 5:1-4, Mark 10:42-45',
    audio_storage_path: SAMPLE_AUDIO_URL_2,
    cover_storage_path: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 2700,
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
    excerpt:
      'Across remote settlements, many families live without access to systematic biblical discipleship. Here is how UJADU Mission is planting faith and hope.',
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
    featured_image_path:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
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
    excerpt:
      'True Christian discipleship is not merely an intellectual agreement with doctrine; it is a transformed daily walk shaped by the Holy Spirit and scripture.',
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
    featured_image_path:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
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
    excerpt:
      'Before seeds of truth take root, the ground must be prepared through sustained, fervent intercession across rural territories.',
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
    featured_image_path:
      'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1200&q=80',
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
    message:
      'Grace to you! I would like to join the UJADU intercessory prayer network to support your rural village missions.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    read: false,
  },
];

const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-1',
    title: 'Rural Discipleship Camp 2026',
    slug: 'rural-discipleship-camp-2026',
    subtitle: 'Equipping Village Pastors, Pioneer Evangelists, and Youth Leaders for Frontier Gospel Impact',
    hero_image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80',
    content: `Welcome to the official portal for the UJADU Annual Rural Discipleship Camp.

This annual gathering unites frontline village ministers, lay evangelists, and discipleship trainees from neglected rural settlements for 5 intensive days of deep biblical instruction, intercession, fellowship, and practical field evangelism strategies.

Our vision is to empower every participant with sound doctrine, fervent prayer lives, and reproducible discipleship tools to plant healthy fellowship gatherings in unreached farming and riverine communities.`,
    sections: [
      {
        id: 'sec-1',
        heading: 'Program Curriculum & Training Tracks',
        content: `Participants undergo systematic training covering three primary tracks:
• Frontier Evangelism & Village Entry Strategies
• Systematic Discipleship & New Believer Mentoring
• Biblical Leadership & Village Church Stewardship`,
      },
      {
        id: 'sec-2',
        heading: 'Camp Logistics & Accommodations',
        content: `All attendees are hosted at the UJADU Rural Base Camp with community dining, open-air devotional spaces, and dormitories provided through our mission partners' sacrificial support.`,
      },
    ],
    slides: [
      {
        id: 'sl-1',
        image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
        title: 'Frontier Discipleship Fellowship',
        caption: 'Gathering under shade trees for deep scriptural exposition and mutual encouragement.',
      },
      {
        id: 'sl-2',
        image_url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
        title: 'Village Bible Study Circles',
        caption: 'Learning inductive Bible study methods to teach remote congregations with clarity and conviction.',
      },
      {
        id: 'sl-3',
        image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
        title: 'Morning Intercessory Prayer Walks',
        caption: 'Commencing each day with dawn prayer walks across farming settlements for spiritual breakthrough.',
      },
    ],
    gallery: [
      {
        id: 'g-1',
        image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
        caption: 'Youth leaders training session in the mission hall',
      },
      {
        id: 'g-2',
        image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
        caption: 'Evening worship gathering with village believers',
      },
      {
        id: 'g-3',
        image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
        caption: 'Distributing open study Bibles to village pastors',
      },
      {
        id: 'g-4',
        image_url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1000&q=80',
        caption: 'Prayer circle for rural mission revival and harvest',
      },
    ],
    audio_title: 'The Call to Rural Frontier Evangelism',
    audio_speaker: 'Evangelist S. O. Okon',
    audio_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audio_duration: 2140,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const STORAGE_KEYS = {
  SETTINGS: 'ujadu_settings',
  GALLERY: 'ujadu_gallery',
  AUDIO: 'ujadu_audio',
  BLOGS: 'ujadu_blogs',
  PAGES: 'ujadu_custom_pages',
  MESSAGES: 'ujadu_messages',
  SUBSCRIBERS: 'ujadu_subscribers',
  ABOUT: 'ujadu_about_content',
};

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'prayer.partner@example.com',
    subscribed_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    active: true,
  },
];

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
    console.warn(`Local storage cache warning for ${key}:`, err);
  }
}

// PRIMARY DATA SERVICE CONNECTED DIRECTLY TO CLOUD FIRESTORE
export class DataService {
  // --- SITE SETTINGS ---
  static async getSiteSettings(): Promise<SiteSettings> {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'site_settings', 'main');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { ...DEFAULT_SITE_SETTINGS, ...(snap.data() as SiteSettings) };
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'site_settings/main');
      }
    }
    return getStoredItem<SiteSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  }

  static async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...settings };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'site_settings', 'main'), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'site_settings/main');
      }
    }

    setStoredItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- ABOUT US CONTENT ---
  static async getAboutContent(): Promise<AboutContent> {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'site_settings', 'about');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const cloudData = snap.data() as Partial<AboutContent>;
          return {
            ...DEFAULT_ABOUT_CONTENT,
            ...cloudData,
            pillars: cloudData.pillars || DEFAULT_ABOUT_CONTENT.pillars,
            strategy_phases: cloudData.strategy_phases || DEFAULT_ABOUT_CONTENT.strategy_phases,
            leadership_team: cloudData.leadership_team || DEFAULT_ABOUT_CONTENT.leadership_team,
            milestones: cloudData.milestones || DEFAULT_ABOUT_CONTENT.milestones,
          };
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'site_settings/about');
      }
    }
    const local = getStoredItem<AboutContent>(STORAGE_KEYS.ABOUT, DEFAULT_ABOUT_CONTENT);
    return {
      ...DEFAULT_ABOUT_CONTENT,
      ...local,
      pillars: local.pillars || DEFAULT_ABOUT_CONTENT.pillars,
      strategy_phases: local.strategy_phases || DEFAULT_ABOUT_CONTENT.strategy_phases,
      leadership_team: local.leadership_team || DEFAULT_ABOUT_CONTENT.leadership_team,
      milestones: local.milestones || DEFAULT_ABOUT_CONTENT.milestones,
    };
  }

  static async updateAboutContent(content: Partial<AboutContent>): Promise<AboutContent> {
    const current = await this.getAboutContent();
    const updated: AboutContent = {
      ...current,
      ...content,
      updated_at: new Date().toISOString(),
    };

    const sanitized = sanitizeForFirestore(updated);

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'site_settings', 'about'), sanitized, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'site_settings/about');
      }
    }

    setStoredItem(STORAGE_KEYS.ABOUT, updated);
    return updated;
  }

  // --- GALLERY IMAGES ---
  static async getGalleryImages(category?: string, includeUnpublished = false): Promise<GalleryItem[]> {
    if (isFirebaseConfigured) {
      try {
        const colRef = collection(db, 'gallery_images');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          let items: GalleryItem[] = snap.docs.map((d) => d.data() as GalleryItem);
          if (!includeUnpublished) items = items.filter((i) => i.published);
          if (category && category !== 'All') items = items.filter((i) => i.category === category);
          return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else {
          // Bootstrap default gallery images to cloud Firestore on initial boot
          for (const item of DEFAULT_GALLERY) {
            await setDoc(doc(db, 'gallery_images', item.id), item).catch(() => {});
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'gallery_images');
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
        storage_path:
          item.storage_path ||
          'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
        alt_text: item.alt_text || item.title || 'Ministry gallery image',
        published: item.published ?? true,
        event_date: item.event_date || new Date().toISOString().split('T')[0],
        location: item.location || 'Mission Field',
        created_at: now,
        updated_at: now,
      };
    }

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'gallery_images', savedItem.id), savedItem, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `gallery_images/${savedItem.id}`);
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
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'gallery_images', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `gallery_images/${id}`);
      }
    }

    const currentItems = getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    const filtered = currentItems.filter((i) => i.id !== id);
    setStoredItem(STORAGE_KEYS.GALLERY, filtered);
    return true;
  }

  // --- FAST CLIENT-SIDE IMAGE COMPRESSION & OPTIMIZATION ---
  // Compresses any uploaded photo (even 10MB phone uploads) to lightweight, retina-sharp ~30KB-40KB JPEG
  // Ensures multiple slides never hit Firestore's 1MB document limit, publishing reliably and instantly
  static async uploadImageFile(file: File, _bucket = 'branding-assets'): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawResult = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx) {
              resolve(rawResult);
              return;
            }

            // Standardize responsive display resolution (960px max dimension gives crisp clarity on retina and phones)
            const MAX_DIMENSION = 960;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_DIMENSION) {
                height = Math.round((height * MAX_DIMENSION) / width);
                width = MAX_DIMENSION;
              }
            } else {
              if (height > MAX_DIMENSION) {
                width = Math.round((width * MAX_DIMENSION) / height);
                height = MAX_DIMENSION;
              }
            }

            canvas.width = width;
            canvas.height = height;

            // Fill white background before drawing
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to optimized JPEG quality 0.70 (~30KB-40KB per slide)
            let compressed = canvas.toDataURL('image/jpeg', 0.70);

            // Safety guard: if still larger than 90KB, recompress to 0.55
            if (compressed.length > 90000) {
              compressed = canvas.toDataURL('image/jpeg', 0.55);
            }
            resolve(compressed);
          } catch {
            resolve(rawResult);
          }
        };
        img.onerror = () => resolve(rawResult);
        img.src = rawResult;
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }

  // --- AUDIO FILE UPLOAD ---
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
    const audioFileId = `aud-file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const { idbRef, objectUrl } = await AudioStore.saveAudioFile(audioFileId, file);

    return {
      url: idbRef,
      objectUrl,
      duration,
      fileName: file.name,
      fileSize: fileSizeStr,
      audioFileId,
    };
  }

  // --- AUDIO TEACHINGS ---
  static async getAudioTeachings(category?: string, includeUnpublished = false): Promise<AudioTeaching[]> {
    let cloudItems: AudioTeaching[] | null = null;

    if (isFirebaseConfigured) {
      try {
        const colRef = collection(db, 'audio_teachings');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          cloudItems = snap.docs.map((d) => d.data() as AudioTeaching);
        } else {
          // Bootstrap default audio recordings into cloud Firestore
          for (const item of DEFAULT_AUDIO) {
            await setDoc(doc(db, 'audio_teachings', item.id), item).catch(() => {});
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'audio_teachings');
      }
    }

    const items = cloudItems || getStoredItem<AudioTeaching[]>(STORAGE_KEYS.AUDIO, DEFAULT_AUDIO);

    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        let storagePath = item.audio_storage_path;
        const fileId =
          item.audio_file_id || (storagePath?.startsWith('idb://') ? storagePath.replace('idb://', '') : null);
        if (fileId) {
          const liveUrl = await AudioStore.getAudioUrl(fileId);
          if (liveUrl) {
            storagePath = liveUrl;
          }
        }
        return {
          ...item,
          audio_storage_path: storagePath || SAMPLE_AUDIO_URL,
          cover_storage_path:
            item.cover_storage_path ||
            'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
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
    let persistentAudioPath = item.audio_storage_path || SAMPLE_AUDIO_URL;
    let fileId = item.audio_file_id;

    if (!fileId && persistentAudioPath.startsWith('idb://')) {
      fileId = persistentAudioPath.replace('idb://', '');
    }
    if (
      fileId &&
      (persistentAudioPath.startsWith('blob:') ||
        (!persistentAudioPath.startsWith('idb://') && !persistentAudioPath.startsWith('http')))
    ) {
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
        cover_storage_path:
          item.cover_storage_path ||
          'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
        duration_seconds: item.duration_seconds || 1800,
        published: item.published ?? true,
        published_at: item.published_at || now,
        created_at: now,
        updated_at: now,
      };
    }

    // Publish to cloud Firestore
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'audio_teachings', saved.id), saved, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `audio_teachings/${saved.id}`);
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
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'audio_teachings', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `audio_teachings/${id}`);
      }
    }

    const current = getStoredItem<AudioTeaching[]>(STORAGE_KEYS.AUDIO, DEFAULT_AUDIO);
    const itemToDelete = current.find((a) => a.id === id);
    if (itemToDelete) {
      const fileId =
        itemToDelete.audio_file_id ||
        (itemToDelete.audio_storage_path?.startsWith('idb://')
          ? itemToDelete.audio_storage_path.replace('idb://', '')
          : null);
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
    let cloudBlogs: BlogPost[] | null = null;

    if (isFirebaseConfigured) {
      try {
        const colRef = collection(db, 'blog_posts');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          cloudBlogs = snap.docs.map((d) => d.data() as BlogPost);
        } else {
          for (const item of DEFAULT_BLOGS) {
            await setDoc(doc(db, 'blog_posts', item.id), item).catch(() => {});
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'blog_posts');
      }
    }

    let items = cloudBlogs || getStoredItem<BlogPost[]>(STORAGE_KEYS.BLOGS, DEFAULT_BLOGS);
    if (!includeDrafts) items = items.filter((b) => b.status === 'published');
    if (category && category !== 'All') items = items.filter((b) => b.category === category);
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getBlogPostBySlug(slug: string, includeDrafts = false): Promise<BlogPost | null> {
    const blogs = await this.getBlogPosts(undefined, includeDrafts);
    return blogs.find((b) => b.slug === slug) || null;
  }

  static async saveBlogPost(item: Partial<BlogPost>): Promise<BlogPost> {
    const now = new Date().toISOString();
    const generateSlug = (title: string) =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    let saved: BlogPost;
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
        featured_image_path:
          item.featured_image_path ||
          'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
        author_name: item.author_name || 'UJADU Discipleship Team',
        category: item.category || 'Discipleship',
        tags: item.tags || ['Discipleship', 'Evangelism'],
        status: item.status || 'draft',
        published_at: item.status === 'published' ? item.published_at || now : undefined,
        created_at: now,
        updated_at: now,
      };
    }

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'blog_posts', saved.id), saved, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `blog_posts/${saved.id}`);
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
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'blog_posts', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `blog_posts/${id}`);
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

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'messages', newMessage.id), newMessage);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `messages/${newMessage.id}`);
      }
    }

    const current = getStoredItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
    current.unshift(newMessage);
    setStoredItem(STORAGE_KEYS.MESSAGES, current);
    return newMessage;
  }

  static async getMessages(): Promise<ContactMessage[]> {
    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(db, 'messages'));
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as ContactMessage);
          return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'messages');
      }
    }
    return getStoredItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  }

  static async markMessageRead(id: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'messages', id), { read: true }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `messages/${id}`);
      }
    }
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

    const subId = `sub-${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const newSub: NewsletterSubscriber = {
      id: subId,
      email: trimmedEmail,
      subscribed_at: new Date().toISOString(),
      active: true,
    };

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'subscribers', subId), newSub, { merge: true });
        return { success: true, message: 'Thank you for subscribing to UJADU Rural Discipleship updates!' };
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `subscribers/${subId}`);
      }
    }

    const subscribers = getStoredItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
    const existing = subscribers.find((s) => s.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: true, message: 'You are already subscribed to the UJADU Ministry newsletter!' };
    }
    subscribers.unshift(newSub);
    setStoredItem(STORAGE_KEYS.SUBSCRIBERS, subscribers);
    return { success: true, message: 'Thank you for subscribing to UJADU Rural Discipleship updates!' };
  }

  static async getSubscribers(): Promise<NewsletterSubscriber[]> {
    if (isFirebaseConfigured) {
      try {
        const snap = await getDocs(collection(db, 'subscribers'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as NewsletterSubscriber);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'subscribers');
      }
    }
    return getStoredItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
  }

  static async deleteSubscriber(id: string): Promise<boolean> {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'subscribers', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `subscribers/${id}`);
      }
    }
    const current = getStoredItem<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, DEFAULT_SUBSCRIBERS);
    const filtered = current.filter((s) => s.id !== id);
    setStoredItem(STORAGE_KEYS.SUBSCRIBERS, filtered);
    return true;
  }

  // --- CUSTOM PAGES (HEADINGS, CONTENTS, GALLERY, SLIDES, AUDIO) ---
  // SAVES DIRECTLY TO CLOUD FIRESTORE FOR INSTANT PUBLIC PUBLISHING
  static async getCustomPages(includeUnpublished = false): Promise<CustomPage[]> {
    let cloudPages: CustomPage[] | null = null;

    if (isFirebaseConfigured) {
      try {
        const colRef = collection(db, 'custom_pages');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          cloudPages = snap.docs.map((d) => d.data() as CustomPage);
        } else {
          // Bootstrap default custom page into cloud Firestore so website has initial data
          for (const page of DEFAULT_CUSTOM_PAGES) {
            await setDoc(doc(db, 'custom_pages', page.id), page).catch(() => {});
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'custom_pages');
      }
    }

    const items = cloudPages || getStoredItem<CustomPage[]>(STORAGE_KEYS.PAGES, DEFAULT_CUSTOM_PAGES);

    // Resolve any IndexedDB audio references to live object URLs if present
    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        let audioPath = item.audio_storage_path;
        const fileId =
          item.audio_file_id || (audioPath?.startsWith('idb://') ? audioPath.replace('idb://', '') : null);
        if (fileId) {
          const liveUrl = await AudioStore.getAudioUrl(fileId);
          if (liveUrl) {
            audioPath = liveUrl;
          }
        }
        return {
          ...item,
          audio_storage_path: audioPath,
        };
      })
    );

    let filtered = resolvedItems;
    if (!includeUnpublished) filtered = filtered.filter((p) => p.published);
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getCustomPageBySlug(slug: string, includeUnpublished = false): Promise<CustomPage | null> {
    const pages = await this.getCustomPages(includeUnpublished);
    return pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  static async saveCustomPage(page: Partial<CustomPage>): Promise<CustomPage> {
    const now = new Date().toISOString();

    let persistentAudioPath = page.audio_storage_path || '';
    let fileId = page.audio_file_id || '';
    if (!fileId && persistentAudioPath.startsWith('idb://')) {
      fileId = persistentAudioPath.replace('idb://', '');
    }
    if (
      fileId &&
      (persistentAudioPath.startsWith('blob:') ||
        (!persistentAudioPath.startsWith('idb://') && !persistentAudioPath.startsWith('http')))
    ) {
      persistentAudioPath = `idb://${fileId}`;
    }

    const cleanSlug = (page.slug || page.title || `page-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const current = getStoredItem<CustomPage[]>(STORAGE_KEYS.PAGES, DEFAULT_CUSTOM_PAGES);
    const existing = page.id ? current.find((p) => p.id === page.id) : null;
    const createdAt = page.created_at || existing?.created_at || now;

    // Sanitize and guarantee no missing IDs or undefined attributes
    const cleanedSlides = sanitizeSlides(page.slides);
    const cleanedSections = (page.sections || []).map((sec, i) => ({
      id: sec.id || `sec-${Date.now()}-${i}`,
      heading: (sec.heading || '').trim() || `Section ${i + 1}`,
      content: (sec.content || '').trim(),
    }));
    const cleanedGallery = (page.gallery || []).map((g, i) => ({
      id: g.id || `g-${Date.now()}-${i}`,
      image_url: (g.image_url || '').trim() || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
      caption: (g.caption || '').trim(),
    }));

    const saved: CustomPage = {
      id: page.id || `page-${Date.now()}`,
      title: (page.title || 'Untitled Page').trim(),
      slug: cleanSlug,
      subtitle: (page.subtitle || '').trim(),
      hero_image: (page.hero_image || '').trim(),
      content: (page.content || '').trim(),
      sections: cleanedSections,
      slides: cleanedSlides,
      gallery: cleanedGallery,
      audio_title: (page.audio_title || '').trim(),
      audio_speaker: (page.audio_speaker || 'Evangelist S. O. Okon').trim(),
      audio_storage_path: persistentAudioPath,
      audio_file_id: fileId,
      audio_duration: page.audio_duration || 0,
      published: page.published ?? true,
      created_at: createdAt,
      updated_at: now,
    };

    // 1. Immediately publish to Cloud Firestore database!
    if (isFirebaseConfigured) {
      try {
        const firestorePayload = sanitizeForFirestore(saved);
        await setDoc(doc(db, 'custom_pages', saved.id), firestorePayload, { merge: true });
        console.log(`Page "${saved.title}" successfully published to cloud Firestore with ${saved.slides?.length || 0} slides and ${saved.gallery?.length || 0} gallery items.`);
      } catch (err) {
        console.error('Firestore saveCustomPage error:', err);
        handleFirestoreError(err, OperationType.WRITE, `custom_pages/${saved.id}`);
        throw err;
      }
    }

    // 2. Also update local cache for offline resiliency
    const idx = current.findIndex((p) => p.id === saved.id);
    if (idx >= 0) {
      current[idx] = saved;
    } else {
      current.unshift(saved);
    }
    setStoredItem(STORAGE_KEYS.PAGES, current);

    // If audio is idb://, resolve to live blob URL before returning so UI can preview immediately
    if (saved.audio_storage_path?.startsWith('idb://')) {
      const liveId = saved.audio_storage_path.replace('idb://', '');
      const liveUrl = await AudioStore.getAudioUrl(liveId);
      if (liveUrl) {
        return { ...saved, audio_storage_path: liveUrl };
      }
    }

    return saved;
  }

  static async deleteCustomPage(id: string): Promise<boolean> {
    // Delete from Cloud Firestore
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'custom_pages', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `custom_pages/${id}`);
      }
    }

    const current = getStoredItem<CustomPage[]>(STORAGE_KEYS.PAGES, DEFAULT_CUSTOM_PAGES);
    const itemToDelete = current.find((p) => p.id === id);
    if (itemToDelete) {
      const fileId =
        itemToDelete.audio_file_id ||
        (itemToDelete.audio_storage_path?.startsWith('idb://')
          ? itemToDelete.audio_storage_path.replace('idb://', '')
          : null);
      if (fileId) {
        await AudioStore.deleteAudioFile(fileId);
      }
    }
    const filtered = current.filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PAGES, filtered);
    return true;
  }

  // --- ADMIN DASHBOARD STATS ---
  static async getAdminStats(): Promise<AdminStats> {
    const allBlogs = await this.getBlogPosts(undefined, true);
    const allGallery = await this.getGalleryImages(undefined, true);
    const allAudio = await this.getAudioTeachings(undefined, true);
    const messages = await this.getMessages();
    const subscribers = await this.getSubscribers();
    const customPages = await this.getCustomPages(true);

    return {
      publishedBlogs: allBlogs.filter((b) => b.status === 'published').length,
      draftBlogs: allBlogs.filter((b) => b.status === 'draft').length,
      publishedGallery: allGallery.filter((g) => g.published).length,
      publishedAudio: allAudio.filter((a) => a.published).length,
      totalMessages: messages.length,
      totalSubscribers: subscribers.length,
      customPages: customPages.length,
    };
  }
}
