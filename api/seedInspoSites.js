/**
 * Inspo Production Websites Seeder for Nexio Hub
 * Reads high-quality production website captures from Skills/Design/inspo
 * and seeds them into MongoDB Atlas (links collection) for the Design & Inspiration tabs.
 *
 * Usage:
 *   node seedInspoSites.js          (Seeds top 250 curated production sites)
 *   node seedInspoSites.js --all    (Seeds all unique production sites)
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

const INSPO_DATA_PATH = path.resolve(__dirname, '../Skills/Design/inspo/packages/db/src/static-screens.json');

// Link Schema matching api/routes/hub.js
const linkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  category: { type: String, default: 'Inspiration', trim: true },
  description: { type: String, default: '', trim: true },
  collection: { type: String, default: 'Design', trim: true },
  badge: { type: String, default: '', trim: true },
  logoUrl: { type: String, default: '', trim: true },
  bannerUrl: { type: String, default: '', trim: true },
  favorite: { type: Boolean, default: false },
  readLater: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  strict: false
});

const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);

function cleanDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return url.replace(/^https?:\/\//i, '').split('/')[0].replace(/^www\./i, '');
  }
}

function determineCategory(tags, mode) {
  const styles = (tags?.style || []).map(s => s.toLowerCase());
  const industries = (tags?.industry || []).map(i => i.toLowerCase());
  const allTags = [...styles, ...industries];

  if (allTags.some(t => t.includes('typography') || t.includes('font'))) {
    return 'Typography';
  }
  if (allTags.some(t => t.includes('developer') || t.includes('saas') || t.includes('infra') || t.includes('fintech') || t.includes('cloud'))) {
    return 'UI/UX';
  }
  if (allTags.some(t => t.includes('ai') || t.includes('model'))) {
    return 'AI Tools';
  }
  return 'Inspiration';
}

function cleanDescription(desc) {
  if (!desc) return '';
  // Split at the tag separator ' · ' if present, take the prose description
  const mainProse = desc.split(' · ')[0] || desc;
  const trimmed = mainProse.trim();
  if (trimmed.length > 200) {
    return trimmed.slice(0, 197) + '...';
  }
  return trimmed;
}

function determineBadge(item) {
  if (item.mode === 'dark') return 'Dark UI';
  const firstStyle = item.tags?.style?.[0];
  if (firstStyle) {
    return firstStyle.charAt(0).toUpperCase() + firstStyle.slice(1);
  }
  return 'Curated';
}

async function runSeeder() {
  console.log('🚀 Starting Inspo Production Sites Seeder for Nexio Hub...');

  if (!fs.existsSync(INSPO_DATA_PATH)) {
    console.error(`❌ Inspo data file not found at: ${INSPO_DATA_PATH}`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(INSPO_DATA_PATH, 'utf8');
  const screens = JSON.parse(rawJson);
  console.log(`📦 Loaded ${screens.length} total screen captures from Inspo.`);

  // Deduplicate by normalized sourceUrl and ensure valid image
  const uniqueSites = new Map();
  for (const s of screens) {
    if (!s.sourceUrl || !s.title) continue;
    const normUrl = s.sourceUrl.trim().toLowerCase().replace(/\/+$/, '');
    if (!uniqueSites.has(normUrl)) {
      uniqueSites.set(normUrl, s);
    }
  }

  const seedAll = process.argv.includes('--all');
  const limit = seedAll ? uniqueSites.size : 250;
  const sitesToSeed = Array.from(uniqueSites.values()).slice(0, limit);

  console.log(`🎯 Prepared ${sitesToSeed.length} unique production sites for seeding.`);

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { dbName: 'wallet' });
  console.log('🟢 Connected to MongoDB Atlas (wallet database)');

  // Prepare idempotent bulk operations
  const bulkOps = sitesToSeed.map((site) => {
    const domain = cleanDomain(site.sourceUrl);
    const category = determineCategory(site.tags, site.mode);
    const badge = determineBadge(site);
    const bannerUrl = site.imageUrl || site.thumbUrl || '';
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const description = cleanDescription(site.description) || `Production website and design references for ${site.title}.`;

    return {
      updateOne: {
        filter: { url: site.sourceUrl },
        update: {
          $set: {
            title: site.title,
            url: site.sourceUrl,
            category,
            description,
            collection: 'Design',
            badge,
            logoUrl,
            bannerUrl,
          },
          $setOnInsert: {
            favorite: false,
            readLater: false,
            createdAt: new Date(),
          }
        },
        upsert: true
      }
    };
  });

  console.log(`⏳ Executing bulk upsert for ${bulkOps.length} items...`);
  const result = await Link.bulkWrite(bulkOps, { ordered: false });

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Upserted: ${result.upsertedCount || 0} new sites`);
  console.log(`🔄 Updated/Verified: ${result.modifiedCount || 0} existing sites`);

  const totalInDB = await Link.countDocuments();
  console.log(`🌟 Total links now in Nexio Hub database: ${totalInDB}`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from database.');
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
