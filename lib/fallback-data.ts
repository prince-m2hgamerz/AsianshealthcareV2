import { apolloDoctors } from "./apollo-doctors-data";

export const fallbackDoctors = apolloDoctors.map((d) => ({
  name: d.name,
  specialty: d.specialty,
  specialties: [d.specialty],
  experience: d.experience,
  experience_years: d.experience_years,
  hospital: d.hospital,
  rating: d.rating,
  slug: d.slug,
  photo_url: d.photo_url,
  qualifications: d.qualifications,
  about: "",
}));

export const fallbackHospitals = [
  {
    name: "Medanta - The Medicity",
    location: "Gurugram, Haryana",
    city: "Gurugram",
    state: "Haryana",
    beds: "1,250+",
    beds_count: 1250,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "medanta-the-medicity",
    photo_url: "/images/hospital-medanta.webp",
    about:
      "Medanta is one of India's largest multi-specialty hospitals with a dedicated international patient wing. It features 45+ operating theatres, advanced robotic surgery systems, and world-renowned cardiac, oncology, transplant, and orthopaedic programs.",
  },
  {
    name: "Apollo Hospitals Indraprastha",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "700+",
    beds_count: 700,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "apollo-hospitals-delhi",
    photo_url: "/images/hospital-apollo.webp",
    about:
      "Apollo Hospitals Indraprastha is a flagship tertiary care hospital in South East Asia with internationally accredited programs in cardiac sciences, oncology, neurosciences, orthopedics, and organ transplantation.",
  },
  {
    name: "Fortis Escorts Heart Institute",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "485+",
    beds_count: 485,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "fortis-escorts-heart-institute",
    photo_url: "/images/hospital-fortis-escorts.webp",
    about:
      "Fortis Escorts Heart Institute is India's most recognised cardiac care hospital, performing over 15,000 cardiac surgeries annually with world-class success rates.",
  },
  {
    name: "Max Super Speciality Hospital Saket",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "680+",
    beds_count: 680,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "max-super-speciality-hospital-saket",
    photo_url: "/images/hospital-max-saket.webp",
    about:
      "Max Super Speciality Hospital Saket is a multi-specialty tertiary care hospital known for its advanced neurosciences, bone marrow transplant program, cardiac care, and oncology services.",
  },
  {
    name: "Sir Ganga Ram Hospital",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "650+",
    beds_count: 650,
    accreditation: "NABH, ISO 9001",
    accreditations: ["NABH", "ISO 9001"],
    slug: "sir-ganga-ram-hospital",
    photo_url: "/images/hospital-ganga-ram.webp",
    about:
      "Sir Ganga Ram Hospital is a premier multi-specialty hospital in New Delhi with a 70-year legacy of medical excellence across cardiology, gastroenterology, nephrology, and urology.",
  },
  {
    name: "BLK-Max Super Speciality Hospital",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "650+",
    beds_count: 650,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "blk-max-super-speciality-hospital",
    photo_url: "/images/hospital-blk-max.webp",
    about:
      "BLK-Max Super Speciality Hospital is a leading healthcare facility in Central Delhi with 650 beds and 17 super-speciality departments, renowned for paediatric cardiac surgery, orthopedics, and fertility treatment.",
  },
  {
    name: "Artemis Hospital Gurugram",
    location: "Gurugram, Haryana",
    city: "Gurugram",
    state: "Haryana",
    beds: "500+",
    beds_count: 500,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "artemis-hospital-gurugram",
    photo_url: "/images/hospital-artemis.webp",
    about:
      "Artemis Hospital is a state-of-the-art multi-specialty hospital in Gurugram with JCI accreditation, offering advanced care in cardiology, orthopedics, IVF, and oncology with a focus on medical tourism.",
  },
  {
    name: "Fortis Memorial Research Institute",
    location: "Gurugram, Haryana",
    city: "Gurugram",
    state: "Haryana",
    beds: "1,000+",
    beds_count: 1000,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "fortis-memorial-research-institute",
    photo_url: "/images/hospital-fmri.webp",
    about:
      "Fortis Memorial Research Institute (FMRI) is a flagship quaternary care hospital with dedicated centres for oncology, neurosciences, orthopedics, cardiac care, and liver transplant.",
  },
  {
    name: "Manipal Hospital Dwarka",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "380+",
    beds_count: 380,
    accreditation: "NABH, ISO 9001",
    accreditations: ["NABH", "ISO 9001"],
    slug: "manipal-hospital-dwarka",
    photo_url: "/images/hospital-manipal-dwarka.webp",
    about:
      "Manipal Hospital Dwarka is a multi-specialty tertiary care hospital serving West Delhi with comprehensive healthcare services including cardiology, orthopedics, neurology, and gastroenterology.",
  },
  {
    name: "Indian Spinal Injuries Centre",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "250+",
    beds_count: 250,
    accreditation: "NABH, ISO 9001",
    accreditations: ["NABH", "ISO 9001"],
    slug: "indian-spinal-injuries-centre",
    photo_url: "/images/hospital-isic.webp",
    about:
      "The Indian Spinal Injuries Centre is Asia's premier institute for spine care and rehabilitation, offering comprehensive treatment for spinal trauma, degenerative spine conditions, and sports injuries.",
  },
  {
    name: "Venkateshwar Hospital",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "350+",
    beds_count: 350,
    accreditation: "NABH",
    accreditations: ["NABH"],
    slug: "venkateshwar-hospital",
    photo_url: "/images/hospital-venkateshwar.webp",
    about:
      "Venkateshwar Hospital is a multi-super-speciality hospital in Dwarka offering advanced medical care in gastroenterology, cardiology, orthopedics, nephrology, and general surgery.",
  },
  {
    name: "Saroj Super Speciality Hospital",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "300+",
    beds_count: 300,
    accreditation: "NABH",
    accreditations: ["NABH"],
    slug: "saroj-super-speciality-hospital",
    photo_url: "/images/hospital-saroj.webp",
    about:
      "Saroj Super Speciality Hospital is a well-established medical facility in Central Delhi known for its urology, nephrology, and general surgery departments at affordable prices.",
  },
  {
    name: "Paras Hospital Gurugram",
    location: "Gurugram, Haryana",
    city: "Gurugram",
    state: "Haryana",
    beds: "350+",
    beds_count: 350,
    accreditation: "NABH, ISO 9001",
    accreditations: ["NABH", "ISO 9001"],
    slug: "paras-hospital-gurugram",
    photo_url: "/images/hospital-paras.webp",
    about:
      "Paras Hospital is a multi-specialty tertiary care hospital in Gurugram with expertise in gastroenterology, bariatric surgery, orthopedics, and fertility treatment.",
  },
  {
    name: "Narayana Superspeciality Hospital Gurugram",
    location: "Gurugram, Haryana",
    city: "Gurugram",
    state: "Haryana",
    beds: "450+",
    beds_count: 450,
    accreditation: "NABH, ISO 9001",
    accreditations: ["NABH", "ISO 9001"],
    slug: "narayana-superspeciality-hospital-gurugram",
    photo_url: "/images/hospital-narayana.webp",
    about:
      "Narayana Superspeciality Hospital is part of the renowned Narayana Health chain, offering affordable cardiac care, oncology, orthopedics, and neurosurgery with outcomes matching global benchmarks.",
  },
  {
    name: "Moolchand Hospital",
    location: "New Delhi, Delhi",
    city: "New Delhi",
    state: "Delhi",
    beds: "325+",
    beds_count: 325,
    accreditation: "NABH, ISO 9001",
    accreditations: ["NABH", "ISO 9001"],
    slug: "moolchand-hospital",
    photo_url: "/images/hospital-moolchand.webp",
    about:
      "Moolchand Hospital is a 325-bed multi-specialty hospital in South Delhi with a 70-year legacy, offering comprehensive care in ophthalmology, orthopedics, cardiology, and women's health.",
  },
  {
    name: "Columbia Asia Hospital Gurugram",
    location: "Gurugram, Haryana",
    city: "Gurugram",
    state: "Haryana",
    beds: "200+",
    beds_count: 200,
    accreditation: "JCI, NABH",
    accreditations: ["JCI", "NABH"],
    slug: "columbia-asia-hospital-gurugram",
    photo_url: "/images/hospital-columbia-asia.webp",
    about:
      "Columbia Asia Hospital is a JCI-accredited tertiary care facility in Gurugram offering comprehensive services in orthopedics, cardiology, and general surgery.",
  },
];

export const fallbackTreatments = [
  {
    name: "Liver Transplant Surgery",
    costMin: 28000,
    costMax: 45000,
    usCost: 180000,
    slug: "liver-transplant",
    category: "Transplant",
    description:
      "Living donor and cadaveric liver transplant at NABH accredited hospitals in India. Includes pre-transplant evaluation, surgery, ICU care, and post-transplant follow-up.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/071607183870.png",
  },
  {
    name: "Kidney Transplant",
    costMin: 13000,
    costMax: 18000,
    usCost: 75000,
    slug: "kidney-transplant",
    category: "Transplant",
    description:
      "Kidney transplant surgery with living or cadaveric donor at top hospitals. Package includes donor evaluation, surgery, immunosuppression planning, and recovery.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/884152601829.jpg",
  },
  {
    name: "Bone Marrow Transplant",
    costMin: 18000,
    costMax: 35000,
    usCost: 250000,
    slug: "bone-marrow-transplant",
    category: "Oncology",
    description:
      "Allogeneic and autologous BMT for leukemia, lymphoma, and blood disorders. Includes HLA matching, conditioning, transplant, and engraftment monitoring.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/510593914830.jpg",
  },
  {
    name: "Knee Replacement",
    costMin: 5000,
    costMax: 7000,
    usCost: 45000,
    slug: "knee-replacement",
    category: "Orthopedics",
    description:
      "Total and partial knee replacement with imported implants at JCI hospitals. Includes pre-op assessment, surgery, physiotherapy, and discharge planning.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/318445058417.jpg",
  },
  {
    name: "Hip Replacement",
    costMin: 6000,
    costMax: 8000,
    usCost: 50000,
    slug: "hip-replacement",
    category: "Orthopedics",
    description:
      "Total hip replacement and hip resurfacing with latest prosthetics. Includes hospital stay, rehabilitation, and follow-up care.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/001428941542.jpg",
  },
  {
    name: "Spine Surgery",
    costMin: 5000,
    costMax: 10000,
    usCost: 65000,
    slug: "spine-surgery",
    category: "Orthopedics",
    description:
      "Minimally invasive spine surgery, disc replacement, spinal fusion, and deformity correction by expert spine surgeons.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/146787701787.png",
  },
  {
    name: "Heart Bypass Surgery (CABG)",
    costMin: 7000,
    costMax: 10000,
    usCost: 100000,
    slug: "heart-bypass-surgery",
    category: "Cardiology",
    description:
      "Coronary artery bypass grafting including on-pump and off-pump techniques. Includes pre-op evaluation, ICU stay, and cardiac rehabilitation.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/155192473072.png",
  },
  {
    name: "Angioplasty and Stenting",
    costMin: 3500,
    costMax: 6000,
    usCost: 30000,
    slug: "angioplasty",
    category: "Cardiology",
    description:
      "Coronary angioplasty with drug-eluting stent placement. Includes cardiac catheterization, stent procedure, monitoring, and follow-up.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/796098408516.jpg",
  },
  {
    name: "IVF Treatment",
    costMin: 3000,
    costMax: 5000,
    usCost: 20000,
    slug: "ivf-treatment",
    category: "Fertility",
    description:
      "Complete IVF cycle including ovarian stimulation, egg retrieval, embryo culture, transfer, and pregnancy testing at top fertility centers.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/274716752857.png",
  },
  {
    name: "Hair Transplant",
    costMin: 1500,
    costMax: 3000,
    usCost: 15000,
    slug: "hair-transplant",
    category: "Cosmetic",
    description:
      "FUE and FUT hair transplant with natural results. Includes consultation, graft planning, procedure, and post-care instructions.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/274716752857.png",
  },
  {
    name: "Bariatric Surgery",
    costMin: 5000,
    costMax: 7500,
    usCost: 25000,
    slug: "bariatric-surgery",
    category: "Gastroenterology",
    description:
      "Gastric sleeve, gastric bypass, and mini gastric bypass. Includes nutritionist consultation, surgery, and long-term diet planning.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/102136737103.png",
  },
  {
    name: "Brain Tumor Surgery",
    costMin: 6500,
    costMax: 10000,
    usCost: 80000,
    slug: "brain-tumor-surgery",
    category: "Neurology",
    description:
      "Craniotomy and minimally invasive brain tumor removal with neuro-navigation guided surgery and ICU care by experienced neurosurgeons.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/216514607672.png",
  },
  {
    name: "Aortic Valve Replacement",
    costMin: 8000,
    costMax: 12000,
    usCost: 80000,
    slug: "aortic-valve-replacement",
    category: "Cardiology",
    description:
      "Surgical and transcatheter aortic valve replacement (TAVR/SAVR). Includes cardiac evaluation and post-operative monitoring.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/816018845104.jpg",
  },
  {
    name: "Oncology Surgery",
    costMin: 5000,
    costMax: 15000,
    usCost: 80000,
    slug: "oncology-surgery",
    category: "Oncology",
    description:
      "Surgical oncology for breast, lung, colon, and stomach cancers. Includes tumor board review, surgery, and chemo planning.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/786610918089.jpg",
  },
  {
    name: "Scoliosis Correction Surgery",
    costMin: 8000,
    costMax: 15000,
    usCost: 100000,
    slug: "scoliosis-surgery",
    category: "Orthopedics",
    description:
      "Spinal deformity correction for adolescent and adult scoliosis with advanced instrumentation and comprehensive rehabilitation.",
    image_url: "https://satyughealthcare.com/uploads/treatment_package/728155135898.jpg",
  },
];

export const fallbackTestimonials = [
  {
    name: "Grace Mwangi",
    country: "Kenya",
    treatment: "Knee Replacement",
    text:
      "I had been suffering from knee pain for years. Asians Healthcare made everything easy - from my visa to hospital stay. The doctors were exceptional.",
    rating: 5,
    videoId: "oB2GzmHqVBM",
  },
  {
    name: "Ahmed Al-Rashid",
    country: "Iraq",
    treatment: "Liver Transplant",
    text:
      "Finding a reliable medical tourism facilitator was my biggest concern. Asians Healthcare exceeded all expectations and coordinated everything perfectly.",
    rating: 5,
    videoId: "3rUulNKF26s",
  },
  {
    name: "Fatima Okafor",
    country: "Nigeria",
    treatment: "IVF Treatment",
    text:
      "After years of trying, Asians Healthcare helped us start our family. The entire team was supportive and professional.",
    rating: 5,
    videoId: "O-Dp9aHZldA",
  },
  {
    name: "James Mwangi",
    country: "Kenya",
    treatment: "Cardiac Bypass",
    text:
      "My heart surgery at Medanta was life-changing. The coordination by Asians Healthcare was flawless from Nairobi to Delhi and back.",
    rating: 5,
    videoId: "",
  },
  {
    name: "Raj Patel",
    country: "United Kingdom",
    treatment: "Hip Replacement",
    text:
      "The cost savings were substantial but the quality of care was world-class. I would recommend Asians Healthcare to anyone considering treatment in India.",
    rating: 5,
    videoId: "",
  },
  {
    name: "Nadia Khan",
    country: "Bangladesh",
    treatment: "Kidney Transplant",
    text:
      "My brother received a life-saving kidney transplant through Asians Healthcare. The coordination, hospital selection, and follow-up were outstanding.",
    rating: 5,
    videoId: "",
  },
];

export const fallbackInsurances = [
  "AAR Insurance Africa",
  "Allianz Care",
  "Britam Health Insurance",
  "Bupa Global",
  "Cigna Global",
  "Jubilee Insurance",
  "SHA Kenya",
  "UAP Old Mutual Insurance",
];

export const fallbackHotels = [
  {
    name: "The Leela Palace New Delhi",
    address: "Chanakyapuri, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Diplomatic Enclave",
    description: "An ultra-luxury palace hotel in the heart of New Delhi's diplomatic enclave. Known for its opulent interiors, world-class dining, and impeccable service. Features a rooftop pool, luxury spa, and fine dining restaurants.",
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Delhi_aerial_photo_04-2016_img20.jpg",
  },
  {
    name: "The Taj Mahal Hotel New Delhi",
    address: "1, Mansingh Road, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "India Gate",
    description: "An iconic luxury hotel overlooking Lutyens' Delhi. The Taj Mahal Hotel has hosted world leaders and dignitaries since 1978. Features exquisite restaurants, a luxury spa, and beautifully landscaped gardens.",
    photo_url: "/images/hotels/taj-mahal-hotel-delhi.jpg",
  },
  {
    name: "ITC Maurya New Delhi",
    address: "Sardar Patel Marg, Chanakyapuri, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Diplomatic Enclave",
    description: "A legendary luxury hotel known for hosting heads of state. Home to Bukhara restaurant, consistently rated among the world's best. Features palatial architecture, award-winning cuisine, and the exclusive Towers wing.",
    photo_url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
  },
  {
    name: "The Imperial New Delhi",
    address: "Janpath, Connaught Place, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Connaught Place",
    description: "A heritage art deco hotel from 1931 on Janpath. The Imperial houses one of India's finest private art collections. Known for The Spice Route restaurant, 1911 bar, and its colonial-era grandeur.",
    photo_url: "/images/hotels/imperial-delhi.jpg",
  },
  {
    name: "The Oberoi New Delhi",
    address: "Dr. Zakir Hussain Marg, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Humayun's Tomb & Delhi Golf Club",
    description: "A modern luxury hotel overlooking the Delhi Golf Club greens. Recently renovated with contemporary design, featuring Threesixtyone\u00b0 restaurant, luxury spa, and stunning city views from every room.",
    photo_url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
  },
  {
    name: "Hyatt Regency Delhi",
    address: "Bhikaji Cama Place, Ring Road, New Delhi",
    stars: 5,
    price: "$$$",
    near: "Safdarjung Hospital & South Delhi",
    description: "A prominent 5-star hotel near major medical institutions in South Delhi. Features multiple dining options, a large outdoor pool, fitness center, and well-appointed rooms ideal for medical tourists.",
    photo_url: "/images/hotels/hyatt-regency-delhi.jpg",
  },
  {
    name: "Shangri-La Eros New Delhi",
    address: "19, Ashoka Road, Connaught Place, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Connaught Place",
    description: "A luxury hotel in the heart of New Delhi near Connaught Place. Known for its spacious rooms, signature Chi Spa, rooftop bar with Parliament views, and award-winning Asian dining at Shang Palace.",
    photo_url: "/images/hotels/shangri-la-delhi.jpg",
  },
  {
    name: "Le Meridien New Delhi",
    address: "Windsor Place, Janpath, New Delhi",
    stars: 5,
    price: "$$$",
    near: "Connaught Place & Janpath",
    description: "A distinctive cylindrical tower hotel on Janpath. Centrally located near Connaught Place, featuring a unique atrium design, rooftop pool, multiple restaurants, and convenient access to metro and major landmarks.",
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Le_Meridien%2C_New_Delhi%2C_India_%28014%29.jpg",
  },
  {
    name: "ITC Wellingdon New Delhi",
    address: "Connaught Place, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Connaught Place",
    description: "A boutique luxury hotel by ITC in the heart of Connaught Place. Features personalized butler service, the acclaimed Dum Pukht Jolly Nabobs restaurant, rooftop bar, and intimate luxury in just 100 rooms.",
    photo_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
  },
  {
    name: "Taj Palace New Delhi",
    address: "2, Sardar Patel Marg, Chanakyapuri, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Dhaula Kuan",
    description: "A grand luxury hotel set on 6 acres of landscaped gardens. Features 403 rooms, the legendary Orient Express restaurant, Blue Bar, luxury spa, and is a preferred choice for state banquets and international conferences.",
    photo_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
  },
  {
    name: "Radisson Blu Plaza Delhi",
    address: "National Highway 8, Mahipalpur, New Delhi",
    stars: 5,
    price: "$$$",
    near: "IGI Airport & Fortis Hospital",
    description: "A premium airport hotel just minutes from IGI Airport and close to Fortis Hospital. Ideal for medical tourists arriving late or departing early. Features modern rooms, a large pool, spa, and multiple dining options.",
    photo_url: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Hotel_Radisson_Blu%2C_Dwarka.jpg",
  },
  {
    name: "The Claridges New Delhi",
    address: "12, Dr APJ Abdul Kalam Road, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "India Gate & Lodhi Garden",
    description: "A heritage luxury hotel since 1952 on tree-lined Aurangzeb Road. Known for Sevilla restaurant, Dhaba by Claridges, afternoon teas, and its old-world colonial charm amidst modern luxury.",
    photo_url: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80",
  },
  {
    name: "JW Marriott Hotel New Delhi Aerocity",
    address: "Asset Area 4, Hospitality District, Aerocity, New Delhi",
    stars: 5,
    price: "$$$",
    near: "IGI Airport",
    description: "A contemporary luxury hotel in Aerocity near the airport. Features 523 rooms, K3 all-day dining, Adrift Kaya Japanese restaurant, expansive spa, and excellent connectivity to South Delhi hospitals.",
    photo_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
  },
  {
    name: "Pullman New Delhi Aerocity",
    address: "Asset 2, Hospitality District, Aerocity, New Delhi",
    stars: 5,
    price: "$$$",
    near: "IGI Airport & Medanta Medicity",
    description: "A stylish French hospitality brand hotel in Aerocity. Known for its vibrant Pluck restaurant, rooftop Pling bar, infinity pool, and modern design. Great access to Gurugram hospitals via expressway.",
    photo_url: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=600&q=80",
  },
  {
    name: "The Lodhi New Delhi",
    address: "Lodhi Road, New Delhi",
    stars: 5,
    price: "$$$$",
    near: "Lodhi Garden & Max Hospital",
    description: "An all-suite luxury boutique hotel with private plunge pools. Set amidst 7 acres of gardens near Lodhi Garden. Features Indian Accent restaurant, Elan spa, and is close to Max and Apollo hospitals in South Delhi.",
    photo_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  },
];

export const fallbackSpecialties = [
  {
    name: "Cardiology",
    slug: "cardiology",
    desc: "Heart care, bypass surgery, valve replacement, angioplasty, and cardiac rehabilitation.",
  },
  {
    name: "Orthopedics",
    slug: "orthopedics",
    desc: "Joint replacement, spine care, sports injury treatment, and fracture management.",
  },
  {
    name: "Neurology",
    slug: "neurology",
    desc: "Stroke care, spine disorders, movement disorders, epilepsy, and neurosurgery coordination.",
  },
  {
    name: "Oncology",
    slug: "oncology",
    desc: "Cancer diagnosis, chemotherapy, radiation therapy, surgical oncology, and second opinions.",
  },
  {
    name: "Gastroenterology",
    slug: "gastroenterology",
    desc: "Digestive health, liver care, bariatric surgery, endoscopy, and transplant evaluation.",
  },
  {
    name: "Nephrology",
    slug: "nephrology",
    desc: "Kidney disease care, dialysis planning, transplant evaluation, and post-treatment support.",
  },
  {
    name: "Urology",
    slug: "urology",
    desc: "Kidney stones, prostate care, robotic urology surgery, and male reproductive health.",
  },
  {
    name: "Fertility",
    slug: "fertility",
    desc: "IVF, ICSI, fertility diagnostics, embryo transfer, and reproductive medicine coordination.",
  },
  {
    name: "Transplant",
    slug: "transplant",
    desc: "Kidney, liver, and bone marrow transplant evaluation with long-stay support planning.",
  },
  {
    name: "Dental",
    slug: "dental",
    desc: "Dental implants, smile design, oral surgery, and staged treatment planning for visitors.",
  },
  {
    name: "Ophthalmology",
    slug: "ophthalmology",
    desc: "Cataract, retina, LASIK, glaucoma, and advanced eye-care procedures.",
  },
  {
    name: "Cosmetic Surgery",
    slug: "cosmetic-surgery",
    desc: "Aesthetic and reconstructive procedures with privacy-focused recovery planning.",
  },
];

export const fallbackBlogs = [
  {
    title: "Why Medical Tourism in India Is Growing: A Complete Guide",
    slug: "medical-tourism-india-guide",
    category: "Treatment Blog",
    author: "Asians Healthcare",
    published_at: "2025-12-15T00:00:00Z",
    thumbnail_url: "https://safartibbi.com/wp-content/uploads/2022/11/apolo-1.jpg",
    content: `<h2>Why India Is a Top Destination for Medical Tourism</h2>
<p>India has emerged as one of the world's leading medical tourism destinations, attracting patients from over 80 countries. With JCI and NABH-accredited hospitals, internationally trained doctors, and treatment costs that are 60-80% lower than in Western countries, India offers exceptional value for medical travelers.</p>
<h2>Key Advantages</h2>
<p><strong>World-Class Healthcare:</strong> India's top hospitals like Apollo, Max, and Artemis maintain international standards with advanced technology and highly skilled specialists. Many have dedicated international patient desks to coordinate your entire journey.</p>
<p><strong>Cost Savings:</strong> A heart bypass surgery that costs $100,000+ in the US can be performed in India for $7,000-$10,000. Hip replacement costs $12,000 in the US versus $4,000 in India. These savings include hospital stay, surgeon fees, and follow-up care.</p>
<p><strong>No Waiting Lists:</strong> Unlike many countries where patients wait months for elective procedures, Indian hospitals can schedule surgeries within days of consultation, making it ideal for time-sensitive treatments.</p>
<h2>Steps to Plan Your Medical Trip</h2>
<ol><li>Share your medical reports with our team</li><li>Receive matched doctor and hospital recommendations</li><li>Get a detailed cost estimate and treatment plan</li><li>Receive visa invitation and travel guidance</li><li>Arrive in India with airport pickup and accommodation arranged</li></ol>`,
  },
  {
    title: "Top 10 Hospitals in Delhi NCR for International Patients",
    slug: "top-hospitals-delhi-international-patients",
    category: "Medical Visa Guide",
    author: "Asians Healthcare",
    published_at: "2025-11-20T00:00:00Z",
    thumbnail_url: "https://getwellgo.com/uploads/hospitals/medanta-gurgaon.jpg",
    content: `<h2>Best Hospitals in Delhi NCR</h2>
<p>Delhi's National Capital Region hosts some of India's finest healthcare institutions, many with dedicated international patient departments. Here are the top hospitals that cater to medical travelers.</p>
<h2>1. Apollo Hospitals Indraprastha</h2>
<p>A flagship tertiary care hospital with internationally accredited programs in cardiac sciences, oncology, neurosciences, and organ transplantation. Apollo's International Patient Services handles over 10,000 international patients annually.</p>
<h2>2. Max Super Speciality Hospital Saket</h2>
<p>Known for advanced neurosciences, bone marrow transplant, and cardiac care. Max has a dedicated International Lounge with translators, visa assistance, and concierge services.</p>
<h2>3. Artemis Hospital Gurugram</h2>
<p>JCI-accredited with state-of-the-art infrastructure. Artemis excels in cardiology, orthopedics, IVF, and oncology with a strong focus on medical tourism comfort.</p>
<h2>4. BLK-Max Super Speciality Hospital</h2>
<p>650-bed facility in Central Delhi renowned for paediatric cardiac surgery, orthopedics, and fertility treatment. BLK has one of India's largest bone marrow transplant units.</p>
<h2>Important Considerations</h2>
<p>When choosing a hospital, consider JCI/NABH accreditation, the hospital's experience with international patients, available translators, and post-discharge follow-up protocols.</p>`,
  },
  {
    title: "Understanding Medical Visa Procedures for India",
    slug: "medical-visa-india-procedures",
    category: "Medical Visa Guide",
    author: "Asians Healthcare",
    published_at: "2025-10-10T00:00:00Z",
    thumbnail_url: "https://satyughealthcare.com/uploads/hospitals/1609996048_moolchand-medcity-hospital-sikandra-agra-hospitals-8xp1twzhgx.jpg",
    content: `<h2>Medical Visa for India: Step-by-Step Guide</h2>
<p>India offers a dedicated Medical Visa (M-visa) for patients seeking treatment at recognized hospitals. This comprehensive guide explains the entire process.</p>
<h2>Eligibility</h2>
<p>A Medical Visa is available to foreign nationals seeking medical treatment at recognized/approved hospitals in India. The visa allows up to three accompanying family members on Medical Attendant Visas.</p>
<h2>Required Documents</h2>
<ul><li>Valid passport with at least 6 months validity</li><li>Medical certificate from a recognized hospital in the home country</li><li>Letter from the Indian hospital confirming treatment and timeline</li><li>Recent passport-size photographs</li><li>Proof of financial means to cover treatment costs</li></ul>
<h2>Application Process</h2>
<ol><li>Apply online through the Indian visa portal</li><li>Upload required documents</li><li>Pay visa fee (varies by nationality)</li><li>Schedule appointment at Indian embassy/consulate if required</li><li>Receive e-Medical Visa within 3-5 working days</li></ol>
<p>The e-Medical Visa is valid for 60 days with triple entry, extendable for up to one year while undergoing treatment.</p>`,
  },
];
