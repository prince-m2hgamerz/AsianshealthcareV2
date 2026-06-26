import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const FILES_DIR = path.join(__dirname, "..", "testimonials-img-video");

interface TestimonialEntry {
  patient_name: string;
  country: string;
  treatment: string;
  text_content: string;
  rating: number;
  image_file: string | null;
  video_file: string | null;
}

const entries: TestimonialEntry[] = [
  {
    patient_name: "Amara Diallo",
    country: "Senegal",
    treatment: "Knee Replacement Surgery",
    text_content: "I had been struggling with knee pain for over five years. The surgery was a success, and now I can walk without any discomfort. The medical team was incredibly professional and caring throughout my stay.",
    rating: 5,
    image_file: "img-1.jpeg",
    video_file: "video-1.mp4",
  },
  {
    patient_name: "Zuri Okeke",
    country: "Nigeria",
    treatment: "Liver Transplant",
    text_content: "The liver transplant saved my life. From the initial consultation to post-surgery follow-up, every step was handled with utmost care and precision. I am forever grateful for the exceptional treatment I received.",
    rating: 5,
    image_file: "img-2.jpeg",
    video_file: "video-2.mp4",
  },
  {
    patient_name: "Kwame Boateng",
    country: "Ghana",
    treatment: "Cardiac Bypass",
    text_content: "After my heart attack, I was terrified. The doctors explained everything clearly and performed a successful bypass surgery. Today I am back to my normal life, and I cannot thank the team enough.",
    rating: 5,
    image_file: "img-3.jpeg",
    video_file: null,
  },
  {
    patient_name: "Fatima Nkosi",
    country: "Tanzania",
    treatment: "Spinal Fusion",
    text_content: "I suffered from chronic back pain for years and could barely walk. The spinal fusion surgery was life-changing. Now I can play with my children again without any pain.",
    rating: 5,
    image_file: "img-4.jpeg",
    video_file: null,
  },
  {
    patient_name: "David Mwangi",
    country: "Kenya",
    treatment: "Hip Replacement",
    text_content: "The hip replacement procedure was smooth and recovery was faster than I expected. The physiotherapy team helped me regain my mobility in just a few weeks. Highly recommended!",
    rating: 5,
    image_file: "img-5.jpeg",
    video_file: null,
  },
  {
    patient_name: "Grace Akinyi",
    country: "Uganda",
    treatment: "Fertility Treatment",
    text_content: "After years of trying to conceive, the fertility treatment finally gave us the miracle we were praying for. The doctors were compassionate and supportive throughout the entire journey.",
    rating: 5,
    image_file: "img-6.jpeg",
    video_file: null,
  },
  {
    patient_name: "Tendai Mukasa",
    country: "Zimbabwe",
    treatment: "Cancer Care & Chemotherapy",
    text_content: "Facing cancer was the hardest battle of my life, but the oncology team stood by me every step of the way. The treatment was world-class, and I am now in remission.",
    rating: 5,
    image_file: "img-7.jpeg",
    video_file: null,
  },
  {
    patient_name: "Nadia Hassan",
    country: "Ethiopia",
    treatment: "Kidney Stone Removal",
    text_content: "The pain from kidney stones was unbearable. The minimally invasive procedure was quick and virtually painless. I was back on my feet in no time. Truly grateful for the excellent care.",
    rating: 5,
    image_file: "img-8.jpeg",
    video_file: null,
  },
  {
    patient_name: "Samuel Ochieng",
    country: "Kenya",
    treatment: "Cataract Surgery",
    text_content: "I was losing my sight and feared I would go blind. The cataract surgery restored my vision completely. It is amazing how such a quick procedure can change your life so dramatically.",
    rating: 5,
    image_file: "img-9.jpeg",
    video_file: null,
  },
  {
    patient_name: "Aisha Mohammed",
    country: "Somalia",
    treatment: "Maternal Health Care",
    text_content: "I traveled from Somalia to receive proper maternal care. The doctors ensured both my baby and I were healthy throughout the pregnancy and delivery. A truly life-saving experience.",
    rating: 5,
    image_file: "img-10.jpeg",
    video_file: null,
  },
];

async function ensureVideoBucket(): Promise<string> {
  const bucketName = "testimonial-videos";
  console.log(`Ensuring "${bucketName}" bucket exists (allows video/mp4)...`);

  // Check if bucket already exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const existing = buckets?.find((b) => b.id === bucketName);

  if (existing) {
    console.log("  Bucket already exists.");
    return bucketName;
  }

  // Create it
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    allowed_mime_types: ["video/mp4", "video/quicktime", "video/x-msvideo"],
    file_size_limit: 52428800,
  });

  if (error) {
    // Try REST API as fallback
    console.log("  SDK failed, trying REST API...");
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        id: bucketName,
        name: bucketName,
        public: true,
        allowed_mime_types: ["video/mp4", "video/quicktime", "video/x-msvideo"],
        file_size_limit: 52428800,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Failed to create bucket: ${response.status} ${errBody}`);
    }
    console.log("  Bucket created via REST API.");
  } else {
    console.log("  Bucket created successfully.");
  }

  return bucketName;
}

async function uploadFile(
  filePath: string,
  fileName: string,
  bucket: string,
  folder: string
): Promise<string | null> {
  const ext = path.extname(fileName).toLowerCase();
  const contentType = ext === ".mp4" ? "video/mp4" : ext === ".jpeg" || ext === ".jpg" ? "image/jpeg" : "application/octet-stream";

  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `${folder}/${fileName}`;

  console.log(`  Uploading ${fileName} (${(fileBuffer.length / 1024 / 1024).toFixed(1)} MB)...`);

  const { error } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error(`  Failed: ${error.message}`);

    // For videos, try without explicit content type
    if (ext === ".mp4") {
      console.log("  Retrying without content type...");
      const { error: retryErr } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, { upsert: true });
      if (retryErr) {
        console.error(`  Retry failed: ${retryErr.message}`);
        return null;
      }
    } else {
      return null;
    }
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  console.log(`  Uploaded: ${publicUrl.publicUrl}`);
  return publicUrl.publicUrl;
}

async function cleanExistingTestimonials() {
  console.log("Cleaning up existing testimonial records from previous run...");
  const { error } = await supabase.from("testimonials").delete().in("patient_name", entries.map((e) => e.patient_name));
  if (error) {
    console.error(`  Cleanup error: ${error.message}`);
  } else {
    console.log("  Cleaned up.");
  }
}

async function main() {
  console.log("=== Upload Testimonials Media ===\n");

  if (!fs.existsSync(FILES_DIR)) {
    console.error(`Directory not found: ${FILES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(FILES_DIR);
  const imageFiles = files.filter((f) => /\.(jpeg|jpg|png|webp|gif)$/i.test(f)).sort();
  const videoFiles = files.filter((f) => /\.mp4$/i.test(f)).sort();

  console.log(`Found ${imageFiles.length} images and ${videoFiles.length} videos\n`);

  // Ensure video bucket exists
  const videoBucket = await ensureVideoBucket();
  console.log("");

  // Upload images to site-images
  const imageBucket = "site-images";
  const imageFolder = "testimonials";
  const imageUrls: Record<string, string> = {};

  console.log("Uploading images to site-images bucket...");
  for (const imgFile of imageFiles) {
    const url = await uploadFile(path.join(FILES_DIR, imgFile), imgFile, imageBucket, imageFolder);
    if (url) imageUrls[imgFile] = url;
  }
  console.log(`Uploaded ${Object.keys(imageUrls).length}/${imageFiles.length} images\n`);

  // Upload videos to testimonial-videos bucket
  const videoFolder = "";
  const videoUrls: Record<string, string> = {};

  console.log("Uploading videos to testimonial-videos bucket...");
  for (const vidFile of videoFiles) {
    const url = await uploadFile(path.join(FILES_DIR, vidFile), vidFile, videoBucket, videoFolder);
    if (url) videoUrls[vidFile] = url;
  }
  console.log(`Uploaded ${Object.keys(videoUrls).length}/${videoFiles.length} videos\n`);

  // Clean up previous run
  await cleanExistingTestimonials();
  console.log("");

  // Insert testimonial records
  console.log("Inserting testimonial records...\n");

  let inserted = 0;
  for (const entry of entries) {
    const imageUrl = entry.image_file && imageUrls[entry.image_file] ? imageUrls[entry.image_file] : null;
    const videoUrl = entry.video_file && videoUrls[entry.video_file] ? videoUrls[entry.video_file] : null;

    const record = {
      patient_name: entry.patient_name,
      country: entry.country,
      treatment: entry.treatment,
      text_content: entry.text_content,
      rating: entry.rating,
      is_approved: true,
      image_url: imageUrl,
      video_url: videoUrl,
    };

    const { error } = await supabase.from("testimonials").insert(record);

    if (error) {
      console.error(`  Error inserting "${entry.patient_name}": ${error.message}`);
    } else {
      console.log(`  Inserted: ${entry.patient_name} (${entry.country}) - ${entry.treatment}${videoUrl ? " [with video]" : ""}`);
      inserted++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Images uploaded: ${Object.keys(imageUrls).length}/${imageFiles.length}`);
  console.log(`Videos uploaded: ${Object.keys(videoUrls).length}/${videoFiles.length}`);
  console.log(`Records inserted: ${inserted}/${entries.length}`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
