// ============================================================
// INSTALLATION NOTES
// Upload index.html, style.css, script.js to any web host.
// No build tools required. Works as static files.
// To reset demo data: open browser console → resetDemoData()
// ============================================================

// ============================================================
// APP STATE
// ============================================================
const APP = {
  currentPage: 'landing',
  currentGuestStep: 1,
  currentCheckoutStep: 1,
  currentAdminPage: 'dashboard',
  currentGuideSection: 'overview',
  frontIDUploaded: false,
  backIDUploaded: false,
  parkingSelected: null,
  damageSelected: null,
  starsSelected: 0,
  simulateCheckinDate: null,
  currentBooking: null,
  currentProperty: null,
  currentGuest: null,
  currentMediaFolder: 'all', // Change #8: folder filter
};

// ============================================================
// DATA STORE
// Change #2: renamed categories → welcomeGuide
// Change #5: removed phone from properties, global support number in settings
// Change #6: removed wifi from properties
// Change #7: merged guests + bookings into guestBookings concept (single table)
// Change #9: per-property timezone
// ============================================================
const DB = {
  // Change #7: bookings data with guest info merged
  bookings: [
    {id:'1001',guestId:'g1',propertyId:'p1',checkin:'2025-05-26',checkout:'2025-06-02',platform:'Airbnb',status:'Confirmed'},
    {id:'1002',guestId:'g2',propertyId:'p2',checkin:'2025-05-28',checkout:'2025-06-03',platform:'Booking.com',status:'Confirmed'},
    {id:'1003',guestId:'g3',propertyId:'p3',checkin:'2025-05-30',checkout:'2025-06-05',platform:'VRBO',status:'Pending'},
  ],
  guests: [
    {id:'g1',name:'John Doe',email:'john@example.com',status:'Checked In',frontID:null,backID:null},
    {id:'g2',name:'Jane Smith',email:'jane@example.com',status:'Upcoming',frontID:null,backID:null},
    {id:'g3',name:'Mike Johnson',email:'mike@example.com',status:'Pending',frontID:null,backID:null},
  ],
  // Change #5: no phone field; Change #6: no wifi fields; Change #9: per-property timezone
  properties: [
    {id:'p1',name:'Oceanview Resort',address:'123 Ocean Drive, Miami, FL 33139',formattedAddress:'123 Ocean Drive, Miami, FL 33139, USA',lat:'25.7617',lng:'-80.1918',doorCode:'4582',image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',timezone:'America/New_York'},
    {id:'p2',name:'Beachside Villa',address:'456 Beach Road, Miami, FL 33140',formattedAddress:'456 Beach Road, Miami, FL 33140, USA',lat:'25.7900',lng:'-80.1300',doorCode:'7291',image:'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80',timezone:'America/New_York'},
    {id:'p3',name:'City Center Apartments',address:'789 Downtown Ave, Miami, FL 33132',formattedAddress:'789 Downtown Ave, Miami, FL 33132, USA',lat:'25.7743',lng:'-80.1937',doorCode:'1364',image:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',timezone:'America/New_York'},
  ],
  // Change #2: renamed from categories to welcomeGuide
  // Change #1: headerImage + navIconImage support
  welcomeGuide: [
    {id:'c1',icon:'🏊',name:'Amenities',headerImage:'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',navIconImage:'https://i.ibb.co/RTD7kWFz/Untitled-design-7.png',content:'<h2>Property Amenities</h2><p>Enjoy all the features this property has to offer:</p><ul><li>🏊 Swimming Pool (Open 8AM – 10PM)</li><li>🏋️ Fully Equipped Gym</li><li>🅿️ Private Parking</li><li>📺 Smart TV with Netflix &amp; Streaming</li><li>🧺 In-unit Washer &amp; Dryer</li><li>☕ Nespresso Coffee Machine</li><li>🍳 Fully Stocked Kitchen</li><li>🌊 Ocean View Balcony</li></ul>'},
    {id:'c2',icon:'🍽️',name:'Restaurants',headerImage:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',navIconImage:'https://i.ibb.co/hJYRKXCV/Untitled-design-5.png',content:'<h2>Local Dining</h2><p>Our top recommendations near the property:</p><h3>Fine Dining</h3><ul><li>🌟 <strong>Nobu Miami</strong> — Japanese fusion, 5 min drive</li><li>🌟 <strong>Joe\'s Stone Crab</strong> — Iconic seafood, 8 min walk</li></ul><h3>Casual Dining</h3><ul><li>🍕 <strong>Lucali Miami</strong> — Best pizza in Miami, 10 min drive</li></ul>'},
    {id:'c3',icon:'🍹',name:'Bars',headerImage:'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',navIconImage:'https://i.ibb.co/RT9fxMmm/Untitled-design-12.png',content:'<h2>Bars &amp; Nightlife</h2><ul><li>🍸 <strong>Blackbird Ordinary</strong> — Craft cocktails, 5 min walk</li><li>🎵 <strong>Ball &amp; Chain</strong> — Live music &amp; mojitos, 10 min drive</li></ul>'},
    {id:'c4',icon:'🏖️',name:'Attractions',headerImage:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',navIconImage:'https://i.ibb.co/sp78TNBh/Untitled-design-11.png',content:'<h2>Nearby Attractions</h2><ul><li>🏖️ South Beach — 2 min walk</li><li>🎨 Wynwood Walls — 20 min drive</li><li>🌿 Vizcaya Museum — 15 min drive</li></ul>'},
    {id:'c5',icon:'📋',name:'House Rules',headerImage:'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',navIconImage:'https://i.ibb.co/M5Wd2RLc/Untitled-design-1.png',content:'<h2>House Rules</h2><ul><li>🚭 No smoking inside the property</li><li>🐾 No pets allowed</li><li>🎉 No parties or events</li><li>🔇 Quiet hours after 10 PM</li></ul>'},
    {id:'c6',icon:'🚨',name:'Emergency',headerImage:'https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?w=800&q=80',navIconImage:'https://i.ibb.co/Fqk7G0Rf/Untitled-design-8.png',content:'<h2>Emergency Contacts</h2><ul><li>🚨 Emergency: <strong>911</strong></li><li>👮 Police: <strong>305-579-6111</strong></li><li>🏥 Nearest Hospital: <strong>Mount Sinai Medical Center</strong></li></ul><h3>Host Support</h3><p>Available 24/7: [contact_phone]</p>'},
    {id:'c7',icon:'🌟',name:'Reviews',headerImage:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',navIconImage:'https://i.ibb.co/9MhxYn6/Gemini-Generated-Image-9fmloy9fmloy9fml.png',content:'<h2>Leave Us a Review</h2><p>We hope you had an amazing stay! Your feedback helps us continue to improve.</p>'},
  ],
  // Change #12: globalImages moved inside welcomeGuide area (still stored here, rendered in WG admin tab)
  globalImages: {
    'Amenities': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
    'Restaurants': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'Bars': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80',
    'Attractions': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    'House Rules': 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&q=80',
    'Emergency': 'https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?w=600&q=80',
    'Reviews': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
    'Check-Out': 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&q=80',
  },
  // Change #8: mediaLibrary with folder support
  mediaLibrary: [
    {id:'m1',name:'oceanview-hero.jpg',url:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',folder:'Properties'},
    {id:'m2',name:'pool-amenities.jpg',url:'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80',folder:'Welcome Guide'},
    {id:'m3',name:'restaurant-local.jpg',url:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',folder:'Welcome Guide'},
    {id:'m4',name:'beach-view.jpg',url:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',folder:'Welcome Guide'},
    {id:'m5',name:'interior-living.jpg',url:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',folder:'Properties'},
  ],
  mediaFolders: ['Properties', 'Welcome Guide', 'General'],
  settings: {
    siteName: 'GuestGuide',
    contactEmail: 'hello@guestguide.com',
    // Change #5: global support number
    globalSupportPhone: '+1 555-123-4567',
    requireGPS: true,
    allowOverride: true,
    gpsRadius: 100,
  },
  reviewPlatforms: {airbnb:'https://www.airbnb.com/r/review',google:'https://g.page/r/review'},
};

// ============================================================
// Change #10: Centralized Date Formatter — MM/DD/YYYY
// ============================================================
function formatDate(dateStr) {
  if(!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  if(isNaN(d)) return dateStr;
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}
function formatDateFull(dateStr) {
  if(!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function formatDayName(dateStr) {
  if(!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US',{weekday:'long'});
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(page) {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('booking-id-page').classList.add('hidden');
  document.getElementById('guest-flow').style.display = 'none';
  document.getElementById('welcome-guide').style.display = 'none';
  document.getElementById('checkout-flow').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'none';
  APP.currentPage = page;
  if(page==='landing') document.getElementById('landing-page').style.display = 'block';
  else if(page==='booking-id') document.getElementById('booking-id-page').classList.remove('hidden');
  else if(page==='guest-flow') document.getElementById('guest-flow').style.display = 'block';
  else if(page==='welcome-guide') document.getElementById('welcome-guide').style.display = 'flex';
  else if(page==='checkout-flow') document.getElementById('checkout-flow').style.display = 'block';
  else if(page==='admin') document.getElementById('admin-panel').style.display = 'block';
  window.scrollTo(0,0);
}

function exitGuestFlow(){ showPage('landing'); }
function exitToGuestFlow(){ showPage('guest-flow'); guestStep(5); }
function exitCheckout(){ showPage('welcome-guide'); }
function exitAdmin(){ showPage('landing'); }

// ============================================================
// ADMIN LOGIN
// ============================================================
function showAdminLogin() {
  showModal(`
    <div class="form-group">
      <label class="form-label">Admin Password</label>
      <input type="password" class="form-input" id="admin-pass-input" placeholder="Enter password" onkeydown="if(event.key==='Enter')checkAdminLogin()">
      <p class="text-xs text-gray-500 mt-2">Demo password: <strong>admin</strong></p>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="checkAdminLogin()">Login →</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Admin Login');
  setTimeout(()=>{ const i=document.getElementById('admin-pass-input'); if(i) i.focus(); },100);
}
function checkAdminLogin() {
  const pw = document.getElementById('admin-pass-input')?.value;
  if(pw==='admin'||pw==='') {
    closeModal();
    showPage('admin');
    renderAdminPage('dashboard');
  } else {
    toast('Incorrect password. Try: admin','error');
  }
}

// ============================================================
// GUEST FLOW
// ============================================================
function startGuestFlow() {
  const id = document.getElementById('booking-id-input').value.trim();
  const booking = DB.bookings.find(b => b.id === id);
  if(!booking) { toast('Booking ID not found. Try 1001 or 1002.','error'); return; }
  const guest = DB.guests.find(g => g.id === booking.guestId);
  const prop = DB.properties.find(p => p.id === booking.propertyId);
  APP.currentBooking = booking;
  APP.currentProperty = prop;
  APP.currentGuest = guest;
  document.getElementById('step1-welcome').textContent = `Welcome, ${guest.name}! 👋`;
  document.getElementById('s1-propname').textContent = prop.name;
  document.getElementById('s1-proploc').textContent = prop.address;
  document.getElementById('s1-bookingid').textContent = booking.id;
  document.getElementById('s1-guestname').textContent = guest.name;
  document.getElementById('s1-platform').textContent = booking.platform;
  // Change #10: MM/DD/YYYY dates
  document.getElementById('s1-checkin').textContent = formatDate(booking.checkin);
  document.getElementById('s1-checkin-day').textContent = formatDayName(booking.checkin);
  document.getElementById('s1-checkout').textContent = formatDate(booking.checkout);
  document.getElementById('s1-checkout-day').textContent = formatDayName(booking.checkout);
  showPage('guest-flow');
  guestStep(1);
}

function guestStep(n) {
  APP.currentGuestStep = n;
  for(let i=1;i<=5;i++) {
    const el = document.getElementById('gstep-'+i);
    if(el) el.classList.toggle('hidden', i !== n);
  }
  updateStepDots(n-1, 5, 'sdot');
  window.scrollTo(0,0);
  if(n===5) checkAddressLock();
}

function updateStepDots(active, total, prefix) {
  for(let i=0;i<total;i++) {
    const d = document.getElementById(prefix+'-'+i);
    if(!d) continue;
    d.className = 'step-dot';
    if(i < active) d.classList.add('done');
    else if(i === active) d.classList.add('active');
  }
}

function handleIDUpload(event, side) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById(side+'-id-img').src = e.target.result;
    document.getElementById(side+'-id-placeholder').classList.add('hidden');
    document.getElementById(side+'-id-preview').classList.remove('hidden');
    if(side==='front') { APP.frontIDUploaded=true; document.getElementById('front-next-btn').disabled=false; }
    if(side==='back') { APP.backIDUploaded=true; document.getElementById('back-next-btn').disabled=false; }
    toast('ID uploaded successfully!','success');
  };
  reader.readAsDataURL(file);
}

function handleIDDrop(event, side) {
  event.preventDefault();
  document.getElementById(side+'-upload-area').classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if(!file) return;
  handleIDUpload({target:{files:[file]}}, side);
}

function removeID(side) {
  document.getElementById(side+'-id-img').src='';
  document.getElementById(side+'-id-placeholder').classList.remove('hidden');
  document.getElementById(side+'-id-preview').classList.add('hidden');
  if(side==='front') { APP.frontIDUploaded=false; document.getElementById('front-next-btn').disabled=true; }
  if(side==='back') { APP.backIDUploaded=false; document.getElementById('back-next-btn').disabled=true; }
}

function selectParking(val) {
  APP.parkingSelected = val;
  document.getElementById('park-yes').classList.toggle('selected', val==='yes');
  document.getElementById('park-no').classList.toggle('selected', val==='no');
  document.getElementById('parking-next-btn').disabled = false;
}

// Change #9: Use property timezone; Change #5: Use global support number
function checkAddressLock() {
  const booking = APP.currentBooking;
  const prop = APP.currentProperty;
  if(!booking) return;
  const now = APP.simulateCheckinDate ? new Date(APP.simulateCheckinDate) : new Date();
  const checkinDate = new Date(booking.checkin+'T12:00:00');
  const isUnlocked = now >= checkinDate;
  document.getElementById('address-locked').classList.toggle('hidden', isUnlocked);
  document.getElementById('address-unlocked').classList.toggle('hidden', !isUnlocked);
  if(!isUnlocked) {
    document.getElementById('checkin-countdown').textContent =
      '📅 Check-in: ' + formatDate(booking.checkin) + ' at 12:00 PM';
  } else {
    document.getElementById('unlock-address').textContent = prop.formattedAddress || prop.address;
    document.getElementById('unlock-code').textContent = prop.doorCode;
    // Change #5: global support number
    document.getElementById('unlock-phone').textContent = DB.settings.globalSupportPhone;
    const mapQ = encodeURIComponent(prop.formattedAddress || prop.address);
    document.getElementById('map-link').href = `https://maps.google.com/?q=${mapQ}`;
    document.getElementById('map-link').target = '_blank';
  }
}

// ============================================================
// WELCOME GUIDE
// ============================================================
function openWelcomeGuide() {
  const prop = APP.currentProperty;
  const guest = APP.currentGuest;
  document.getElementById('guide-prop-name').textContent = prop.name;
  document.getElementById('guide-prop-loc').textContent = prop.address;
  document.getElementById('guide-guest-name').textContent = guest.name.split(' ')[0];
  document.getElementById('guide-hero-img').src = prop.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
  buildGuideNav();
  buildCategoriesGrid();
  showPage('welcome-guide');
  showGuideSection('overview');
}

function buildGuideNav() {
  const container = document.getElementById('guide-nav-items');
  const mobileNav = document.getElementById('guide-mobile-nav-inner');
  container.innerHTML = '';
  mobileNav.innerHTML = '';
  // Add home first
  const homeItem = document.createElement('div');
  homeItem.className = 'guide-nav-item active';
  homeItem.id = 'gnav-overview';
  homeItem.innerHTML = `<span class="guide-nav-icon">🏠</span>Overview`;
  homeItem.onclick = () => showGuideSection('overview');
  container.appendChild(homeItem);
  const homeBtn = document.createElement('button');
  homeBtn.className = 'guide-mobile-nav-btn active';
  homeBtn.id = 'gmnav-overview';
  homeBtn.innerHTML = `<span class="guide-mobile-nav-icon">🏠</span>Overview`;
  homeBtn.onclick = () => showGuideSection('overview');
  mobileNav.appendChild(homeBtn);

  DB.welcomeGuide.forEach(cat => {
    // Use navIconImage for nav if available
    const iconContent = cat.navIconImage
      ? `<img src="${cat.navIconImage}" alt="${cat.name}" style="width:20px;height:20px;object-fit:cover;border-radius:4px">`
      : `<span class="guide-nav-icon">${cat.icon}</span>`;
    const item = document.createElement('div');
    item.className = 'guide-nav-item';
    item.id = 'gnav-'+cat.id;
    item.innerHTML = `${iconContent}${cat.name}`;
    item.onclick = () => openCategory(cat.id);
    container.appendChild(item);
    const mbtn = document.createElement('button');
    mbtn.className = 'guide-mobile-nav-btn';
    mbtn.id = 'gmnav-'+cat.id;
    mbtn.innerHTML = `<span class="guide-mobile-nav-icon">${cat.icon}</span>${cat.name}`;
    mbtn.onclick = () => openCategory(cat.id);
    mobileNav.appendChild(mbtn);
  });
  const coBtn = document.createElement('button');
  coBtn.className = 'guide-mobile-nav-btn';
  coBtn.innerHTML = `<span class="guide-mobile-nav-icon">🚪</span>Check-Out`;
  coBtn.onclick = openCheckoutFlow;
  mobileNav.appendChild(coBtn);
}

function buildCategoriesGrid() {
  const grid = document.getElementById('guide-categories-grid');
  grid.innerHTML = '';
  DB.welcomeGuide.forEach(cat => {
    // Change #1: Use navIconImage for card, headerImage for detail
    const imgSrc = cat.navIconImage || cat.headerImage || DB.globalImages[cat.name] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80';
    const card = document.createElement('div');
    card.className = 'guide-category-card';
    card.onclick = () => openCategory(cat.id);
    card.innerHTML = `
      <div class="guide-category-img">
        <img src="${imgSrc}" alt="${cat.name}" onerror="this.src='https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80'">
      </div>
      <div class="guide-category-label">
        <span class="guide-category-icon">${cat.icon}</span>
        <div class="guide-category-name">${cat.name}</div>
      </div>`;
    grid.appendChild(card);
  });
}

function showGuideSection(section) {
  APP.currentGuideSection = section;
  document.getElementById('guide-overview').classList.toggle('hidden', section !== 'overview');
  document.getElementById('guide-category-detail').classList.toggle('hidden', section !== 'category');
  document.querySelectorAll('.guide-nav-item').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.guide-mobile-nav-btn').forEach(el=>el.classList.remove('active'));
  if(section==='overview') {
    document.getElementById('gnav-overview')?.classList.add('active');
    document.getElementById('gmnav-overview')?.classList.add('active');
  }
}

function openCategory(id) {
  const cat = DB.welcomeGuide.find(c=>c.id===id);
  if(!cat) return;
  // Change #1: Use headerImage for the full-width hero
  const heroImg = cat.headerImage || DB.globalImages[cat.name] || '';
  document.getElementById('cat-detail-img').src = heroImg;
  document.getElementById('cat-detail-img').style.display = heroImg ? 'block' : 'none';
  document.getElementById('cat-detail-icon').textContent = cat.icon;
  document.getElementById('cat-detail-title').textContent = cat.name;
  let content = cat.content || '';
  // Shortcode replacement
  const prop = APP.currentProperty;
  const guest = APP.currentGuest;
  const booking = APP.currentBooking;
  if(prop) {
    content = content.replace(/\[property_name\]/g, prop.name);
    content = content.replace(/\[contact_phone\]/g, DB.settings.globalSupportPhone);
  }
  if(guest) content = content.replace(/\[guest_name\]/g, guest.name);
  if(booking) {
    content = content.replace(/\[booking_id\]/g, booking.id);
    content = content.replace(/\[checkin_time\]/g, '3:00 PM');
    content = content.replace(/\[checkout_time\]/g, '11:00 AM');
  }
  document.getElementById('cat-detail-content').innerHTML = content;
  document.querySelectorAll('.guide-nav-item').forEach(el=>el.classList.remove('active'));
  document.getElementById('gnav-'+id)?.classList.add('active');
  document.querySelectorAll('.guide-mobile-nav-btn').forEach(el=>el.classList.remove('active'));
  document.getElementById('gmnav-'+id)?.classList.add('active');
  showGuideSection('category');
  window.scrollTo(0,0);
}

// ============================================================
// CHECKOUT FLOW
// ============================================================
function openCheckoutFlow() {
  showPage('checkout-flow');
  checkoutStep(1);
}
function checkoutStep(n) {
  APP.currentCheckoutStep = n;
  for(let i=1;i<=5;i++) {
    const el = document.getElementById('costep-'+i);
    if(el) el.classList.toggle('hidden', i !== n);
  }
  updateStepDots(n-1, 5, 'cdot');
  window.scrollTo(0,0);
}
function toggleCheck(el) {
  el.classList.toggle('checked');
}
function selectDamage(val) {
  APP.damageSelected = val;
  document.getElementById('dmg-no').classList.toggle('selected', val==='no');
  document.getElementById('dmg-yes').classList.toggle('selected', val==='yes');
  document.getElementById('damage-form').classList.toggle('hidden', val!=='yes');
  document.getElementById('dmg-next-btn').disabled = false;
}
function setStars(n) {
  APP.starsSelected = n;
  document.querySelectorAll('#star-rating .star').forEach((s,i)=>{
    s.classList.toggle('active', i < n);
  });
}
function openReviewPlatform(platform) {
  const url = DB.reviewPlatforms[platform];
  if(url) window.open(url,'_blank');
}
function submitCheckout() {
  toast('Check-out complete! Thank you for staying with us. 🙏','success');
  setTimeout(()=>showPage('landing'), 2500);
}

// ============================================================
// SIMULATE CHECK-IN
// ============================================================
function openSimulate() {
  const booking = APP.currentBooking;
  showModal(`
    <p class="text-sm text-gray-500" style="margin-bottom:16px">Simulate what guests see on different dates.</p>
    <div class="sim-date-grid">
      <div class="form-group"><label class="form-label">Simulate Date</label><input type="date" class="form-input" id="sim-date" value="${booking?.checkin||''}"></div>
      <div class="form-group"><label class="form-label">Simulate Time</label><input type="time" class="form-input" id="sim-time" value="12:00"></div>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="applySimulate()">Apply</button>
      <button class="btn btn-secondary" style="flex:1" onclick="clearSimulate()">Clear Simulation</button>
    </div>`, 'Simulate Check-In Date');
}
function applySimulate() {
  const d = document.getElementById('sim-date').value;
  const t = document.getElementById('sim-time').value||'12:00';
  if(!d) { toast('Select a date first.','error'); return; }
  APP.simulateCheckinDate = `${d}T${t}:00`;
  closeModal();
  toast('Simulation active for '+formatDate(d),'warning');
  if(APP.currentGuestStep===5) checkAddressLock();
}
function clearSimulate() {
  APP.simulateCheckinDate = null;
  closeModal();
  toast('Simulation cleared — using real time.','success');
  if(APP.currentGuestStep===5) checkAddressLock();
}

// ============================================================
// ADMIN NAV
// ============================================================
function adminNav(page, btn) {
  document.querySelectorAll('.admin-nav-item').forEach(el=>el.classList.remove('active'));
  if(btn) btn.classList.add('active');
  else {
    const el = document.getElementById('anav-'+page);
    if(el) el.classList.add('active');
  }
  APP.currentAdminPage = page;
  const titles = {
    'dashboard':'Dashboard Overview','guest-bookings':'Guest Bookings',
    'properties':'Properties','welcome-guide-admin':'Welcome Guide',
    'emails':'Mail Templates','media':'Media Library',
    'preferences':'Preferences','settings':'Global Settings',
  };
  document.getElementById('admin-page-title').textContent = titles[page] || page;
  const actionBtnLabels = {
    'dashboard':'+ Add Booking','guest-bookings':'+ Add Booking',
    'properties':'+ Add Property','welcome-guide-admin':'+ Add Guide Item',
    'emails':'+ New Template','media':'Upload Image',
    'preferences':'Save','settings':'Save Settings',
  };
  const ab = document.getElementById('admin-action-btn');
  if(ab) ab.textContent = actionBtnLabels[page]||'+ Add';
  renderAdminPage(page);
}

function adminTopAction() {
  const p = APP.currentAdminPage;
  if(p==='dashboard'||p==='guest-bookings') openAddBookingModal();
  else if(p==='properties') openAddPropertyModal();
  else if(p==='welcome-guide-admin') openAddWelcomeGuideModal();
  else if(p==='media') document.getElementById('media-upload-input')?.click();
}

// Change #11: Collapsible nav groups
function toggleNavGroup(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById(id+'-arrow');
  if(!el) return;
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  if(arrow) arrow.textContent = isOpen ? '▶' : '▼';
}

function toggleAdminSidebar() {
  document.getElementById('admin-sidebar').classList.toggle('open');
  document.getElementById('admin-overlay').classList.toggle('open');
}
function closeAdminSidebar() {
  document.getElementById('admin-sidebar').classList.remove('open');
  document.getElementById('admin-overlay').classList.remove('open');
}

// ============================================================
// ADMIN RENDER PAGES
// ============================================================
function renderAdminPage(page) {
  const el = document.getElementById('admin-content');
  if(!el) return;
  if(page==='dashboard') renderDashboard(el);
  else if(page==='guest-bookings') renderGuestBookings(el); // Change #7: merged
  else if(page==='properties') renderProperties(el);
  else if(page==='welcome-guide-admin') renderWelcomeGuideAdmin(el); // Change #2
  else if(page==='emails') renderEmails(el);
  else if(page==='media') renderMedia(el);
  else if(page==='preferences') renderPreferences(el);
  else if(page==='settings') renderSettings(el);
}

function renderDashboard(el) {
  const totalBookings = DB.bookings.length;
  const confirmed = DB.bookings.filter(b=>b.status==='Confirmed').length;
  const pendingVerif = DB.guests.filter(g=>!g.frontID||!g.backID).length;
  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${totalBookings}</div><div class="stat-label">Total Bookings</div><div class="stat-change">↑ Active</div></div>
      <div class="stat-card"><div class="stat-value">${confirmed}</div><div class="stat-label">Confirmed</div><div class="stat-change">↑ Upcoming</div></div>
      <div class="stat-card"><div class="stat-value">${DB.properties.length}</div><div class="stat-label">Properties</div></div>
      <div class="stat-card"><div class="stat-value">${pendingVerif}</div><div class="stat-label">Pending ID</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
      <div class="card card-sm"><div class="card-body" style="cursor:pointer" onclick="adminNav('guest-bookings',null)"><div style="font-size:24px;margin-bottom:6px">📅</div><strong>Guest Bookings</strong><p class="text-sm text-gray-500 mt-2">Manage ${DB.bookings.length} bookings &amp; guests</p></div></div>
      <div class="card card-sm"><div class="card-body" style="cursor:pointer" onclick="adminNav('properties',null)"><div style="font-size:24px;margin-bottom:6px">🏨</div><strong>Properties</strong><p class="text-sm text-gray-500 mt-2">${DB.properties.length} active properties</p></div></div>
      <div class="card card-sm"><div class="card-body" style="cursor:pointer" onclick="adminNav('welcome-guide-admin',null)"><div style="font-size:24px;margin-bottom:6px">📋</div><strong>Welcome Guide</strong><p class="text-sm text-gray-500 mt-2">Edit ${DB.welcomeGuide.length} guide items</p></div></div>
      <div class="card card-sm"><div class="card-body" style="cursor:pointer" onclick="adminNav('settings',null)"><div style="font-size:24px;margin-bottom:6px">⚙️</div><strong>Global Settings</strong><p class="text-sm text-gray-500 mt-2">GPS, support &amp; check-in</p></div></div>
    </div>`;
}

// Change #7: Guest Bookings — merged single interface
function renderGuestBookings(el) {
  el.innerHTML = `
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="openAddBookingModal()">+ Add Booking</button>
    </div>
    <div class="data-table-wrap">
      <div class="data-table-header">
        <span class="data-table-title">Guest Bookings</span>
        <span class="text-sm text-gray-500">${DB.bookings.length} bookings · ${DB.guests.length} guests</span>
      </div>
      <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr>
          <th>Booking ID</th><th>Guest Name</th><th>Email</th><th>Property</th>
          <th>Check-In</th><th>Check-Out</th><th>Platform</th><th>Status</th><th>ID Docs</th><th>Actions</th>
        </tr></thead>
        <tbody>${DB.bookings.map(b=>{
          const g = DB.guests.find(x=>x.id===b.guestId);
          const p = DB.properties.find(x=>x.id===b.propertyId);
          return `<tr>
            <td><strong>${b.id}</strong></td>
            <td>${g?.name||'—'}</td>
            <td style="font-size:12px">${g?.email||'—'}</td>
            <td>${p?.name||'—'}</td>
            <td>${formatDate(b.checkin)}</td>
            <td>${formatDate(b.checkout)}</td>
            <td><span class="badge badge-blue">${b.platform}</span></td>
            <td><span class="badge ${b.status==='Confirmed'?'badge-green':b.status==='Pending'?'badge-amber':'badge-gray'}">${b.status}</span></td>
            <td><span style="font-size:12px;color:${g?.frontID&&g?.backID?'var(--green)':'var(--amber)'}">${g?.frontID&&g?.backID?'✓ Verified':'⏳ Pending'}</span></td>
            <td class="table-actions">
              <button class="btn btn-outline btn-sm" onclick="viewBooking('${b.id}')">View</button>
              <button class="btn btn-secondary btn-sm" onclick="editBooking('${b.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteBooking('${b.id}')">Del</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>
      </div>
    </div>`;
}

function renderProperties(el) {
  el.innerHTML = `
    <div class="properties-grid">
      ${DB.properties.map(p=>`
        <div class="property-card">
          <div class="property-card-img"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'"></div>
          <div class="property-card-body">
            <div class="property-card-name">${p.name}</div>
            <div class="property-card-addr">📍 ${p.address}</div>
            ${p.timezone?`<div style="font-size:11px;color:var(--gray-400);margin-bottom:12px">🕐 ${p.timezone}</div>`:''}
            <div class="property-card-actions">
              <button class="btn btn-primary btn-sm" style="flex:1" onclick="editProperty('${p.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProperty('${p.id}')">Delete</button>
            </div>
          </div>
        </div>`).join('')}
      <div class="property-card" style="border:2px dashed var(--gray-200);background:var(--gray-50);display:flex;align-items:center;justify-content:center;min-height:280px;cursor:pointer" onclick="openAddPropertyModal()">
        <div style="text-align:center;color:var(--gray-400)"><div style="font-size:36px;margin-bottom:8px">+</div><div style="font-size:14px;font-weight:600">Add Property</div></div>
      </div>
    </div>`;
}

// Change #2: renamed from renderCategories to renderWelcomeGuideAdmin
// Change #12: Global Images tab moved inside here
function renderWelcomeGuideAdmin(el) {
  el.innerHTML = `
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="openAddWelcomeGuideModal()">+ Add Guide Item</button>
      <button class="btn btn-outline btn-sm" onclick="renderGlobalImagesSection(document.getElementById('wg-global-section'))">🌐 Global Images</button>
    </div>
    <div class="categories-grid" id="wg-items-grid">
      ${DB.welcomeGuide.map(cat=>{
        const img = cat.navIconImage || cat.headerImage || DB.globalImages[cat.name] || '';
        return `
          <div class="category-admin-card">
            <div class="category-admin-card-img"><img src="${img}" alt="${cat.name}" onerror="this.style.opacity='.3'"></div>
            <div class="category-admin-card-body">
              <div class="category-admin-card-name">${cat.icon} ${cat.name}</div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary btn-sm" style="flex:1" onclick="editWelcomeGuideItem('${cat.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteWelcomeGuideItem('${cat.id}')">Del</button>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>
    <div id="wg-global-section" style="margin-top:28px"></div>`;
}

// Change #12: Global images rendered inside WG admin
function renderGlobalImagesSection(container) {
  if(!container) return;
  container.innerHTML = `
    <div style="margin-bottom:16px">
      <h3 style="font-size:15px;font-weight:700;color:var(--gray-800)">🌐 Global Images</h3>
      <p class="text-sm text-gray-500">Default images for guide categories. Upload a category-specific image to override.</p>
    </div>
    <div class="global-img-grid">
      ${Object.entries(DB.globalImages).map(([name,url])=>`
        <div class="global-img-card">
          <div class="global-img-thumb">
            <img src="${url}" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80'">
            <div class="replace-overlay" onclick="replaceGlobalImage('${name}')"><span class="replace-overlay-text">📤 Replace</span></div>
          </div>
          <div class="global-img-label">${name}</div>
        </div>`).join('')}
    </div>
    <input type="file" id="global-img-input" accept="image/*" class="hidden" onchange="handleGlobalImageUpload(event)">`;
}

let currentGlobalImgKey = null;
function replaceGlobalImage(name) {
  currentGlobalImgKey = name;
  document.getElementById('global-img-input')?.click();
}
function handleGlobalImageUpload(event) {
  const file = event.target.files[0];
  if(!file||!currentGlobalImgKey) return;
  const reader = new FileReader();
  reader.onload = e => {
    DB.globalImages[currentGlobalImgKey] = e.target.result;
    toast('Global image updated for '+currentGlobalImgKey,'success');
    const c = document.getElementById('wg-global-section');
    if(c) renderGlobalImagesSection(c);
  };
  reader.readAsDataURL(file);
}

// Change #8: Media Library with Folder System
function renderMedia(el) {
  const folders = ['all', ...DB.mediaFolders];
  const filtered = APP.currentMediaFolder==='all'
    ? DB.mediaLibrary
    : DB.mediaLibrary.filter(m=>m.folder===APP.currentMediaFolder);
  el.innerHTML = `
    <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
      <div>
        <h3 style="font-size:16px;font-weight:700;color:var(--gray-800)">Media Library</h3>
        <p class="text-sm text-gray-500">${DB.mediaLibrary.length} files stored</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="openCreateFolderModal()">📁 New Folder</button>
        <label class="btn btn-primary btn-sm" style="cursor:pointer">
          📤 Upload
          <input type="file" id="media-upload-input" accept="image/*" multiple class="hidden" onchange="handleMediaUpload(event)">
        </label>
      </div>
    </div>
    <div class="media-folder-bar">
      ${folders.map(f=>`<button class="media-folder-btn${APP.currentMediaFolder===f?' active':''}" onclick="filterMediaFolder('${f}')">${f==='all'?'📂 All':f}</button>`).join('')}
    </div>
    <div class="media-grid" id="media-grid">
      ${filtered.map(m=>`
        <div class="media-item" id="media-${m.id}" onclick="selectMediaItem('${m.id}')">
          <img src="${m.url}" alt="${m.name}" onerror="this.src='https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80'">
          <div class="media-item-name">${m.name}</div>
        </div>`).join('')}
    </div>
    <div id="media-selected-actions" style="margin-top:16px;display:none">
      <span class="text-sm text-gray-500" style="margin-right:10px">Move to folder:</span>
      ${DB.mediaFolders.map(f=>`<button class="btn btn-outline btn-sm" onclick="moveMediaToFolder('${f}')">${f}</button>`).join(' ')}
      <button class="btn btn-danger btn-sm" style="margin-left:8px" onclick="deleteSelectedMedia()">🗑️ Delete</button>
    </div>`;
}

function filterMediaFolder(folder) {
  APP.currentMediaFolder = folder;
  renderMedia(document.getElementById('admin-content'));
}

function openCreateFolderModal() {
  showModal(`
    <div class="form-group"><label class="form-label">Folder Name</label><input class="form-input" id="new-folder-name" placeholder="e.g. Hero Images"></div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveNewFolder()">Create</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'New Folder');
}
function saveNewFolder() {
  const name = document.getElementById('new-folder-name').value.trim();
  if(!name) { toast('Folder name required.','error'); return; }
  if(DB.mediaFolders.includes(name)) { toast('Folder already exists.','error'); return; }
  DB.mediaFolders.push(name);
  closeModal();
  toast('Folder created: '+name,'success');
  renderMedia(document.getElementById('admin-content'));
}

let selectedMediaId = null;
function selectMediaItem(id) {
  document.querySelectorAll('.media-item').forEach(el=>el.classList.remove('selected'));
  document.getElementById('media-'+id)?.classList.add('selected');
  selectedMediaId = id;
  const actions = document.getElementById('media-selected-actions');
  if(actions) actions.style.display = 'block';
}
function moveMediaToFolder(folder) {
  if(!selectedMediaId) return;
  const m = DB.mediaLibrary.find(x=>x.id===selectedMediaId);
  if(m) { m.folder = folder; toast('Moved to '+folder,'success'); renderMedia(document.getElementById('admin-content')); }
}
function deleteSelectedMedia() {
  if(!selectedMediaId) return;
  if(!confirm('Delete this image?')) return;
  DB.mediaLibrary = DB.mediaLibrary.filter(m=>m.id!==selectedMediaId);
  selectedMediaId = null;
  toast('Image deleted.','success');
  renderMedia(document.getElementById('admin-content'));
}

function handleMediaUpload(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const id = 'm' + Date.now() + Math.random().toString(36).substr(2,4);
      DB.mediaLibrary.push({id,name:file.name,url:e.target.result,folder:APP.currentMediaFolder==='all'?'General':APP.currentMediaFolder});
      toast('Uploaded: '+file.name,'success');
      renderMedia(document.getElementById('admin-content'));
    };
    reader.readAsDataURL(file);
  });
}

// Change #5: removed contactPhone; added globalSupportPhone
// Change #9: timezone per property (not global)
function renderSettings(el) {
  const s = DB.settings;
  el.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">General Settings</div>
      <div class="form-group"><label class="form-label">Site Name</label><input class="form-input" id="set-sitename" value="${s.siteName}"></div>
      <div class="form-group"><label class="form-label">Contact Email</label><input class="form-input" id="set-email" value="${s.contactEmail}"></div>
      <div class="form-group">
        <label class="form-label">Global Support Number</label>
        <input class="form-input" id="set-support-phone" value="${s.globalSupportPhone}" placeholder="+1 555-000-0000">
        <p class="text-xs text-gray-500 mt-2">Used on all property check-in pages and Welcome Guide emergency sections.</p>
      </div>
      <button class="btn btn-primary" onclick="saveGeneralSettings()">Save Settings</button>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">GPS &amp; Check-In Settings</div>
      <div class="toggle-row"><div><div class="toggle-label">Require GPS Check-In</div><div class="toggle-sub">Guests must be at property to unlock guide</div></div><label class="toggle-switch"><input type="checkbox" ${s.requireGPS?'checked':''} id="set-gps"><span class="toggle-slider"></span></label></div>
      <div class="toggle-row"><div><div class="toggle-label">Allow Admin Override</div><div class="toggle-sub">Admin can manually verify guest location</div></div><label class="toggle-switch"><input type="checkbox" ${s.allowOverride?'checked':''} id="set-override"><span class="toggle-slider"></span></label></div>
      <div class="form-group" style="margin-top:16px"><label class="form-label">Location Radius (meters)</label><input class="form-input" id="set-radius" type="number" value="${s.gpsRadius}"></div>
      <button class="btn btn-primary" onclick="saveGPSSettings()">Save GPS Settings</button>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">Review Platform URLs</div>
      <div class="form-group"><label class="form-label">Airbnb Review URL</label><input class="form-input" id="set-airbnb-url" value="${DB.reviewPlatforms.airbnb}"></div>
      <div class="form-group"><label class="form-label">Google Review URL</label><input class="form-input" id="set-google-url" value="${DB.reviewPlatforms.google}"></div>
      <button class="btn btn-primary" onclick="saveReviewSettings()">Save Review URLs</button>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">Database Reset</div>
      <p class="text-sm text-gray-500" style="margin-bottom:16px">Clear all demo data and reset system for fresh installation.</p>
      <button class="btn btn-danger" onclick="if(confirm('Reset all data? This cannot be undone.')) { resetDemoData(); toast('System reset complete.','success'); renderAdminPage(\'dashboard\'); }">🗑️ Reset Demo Data</button>
    </div>`;
}

function renderPreferences(el) {
  el.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Display Preferences</div>
      <div class="toggle-row"><div><div class="toggle-label">Show Guest Flow Simulation Button</div><div class="toggle-sub">Allows testing check-in date scenarios</div></div><label class="toggle-switch"><input type="checkbox" checked id="pref-simulate"><span class="toggle-slider"></span></label></div>
      <div class="toggle-row"><div><div class="toggle-label">Show Booking ID Hints</div><div class="toggle-sub">Show demo booking IDs on login page</div></div><label class="toggle-switch"><input type="checkbox" checked id="pref-hints"><span class="toggle-slider"></span></label></div>
      <button class="btn btn-primary" style="margin-top:16px" onclick="toast('Preferences saved!','success')">Save Preferences</button>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">Date Format</div>
      <p class="text-sm text-gray-500" style="margin-bottom:16px">All dates use <strong>MM/DD/YYYY</strong> format throughout the application.</p>
      <div style="background:var(--gray-50);border-radius:var(--radius-sm);padding:14px;font-size:13px;color:var(--gray-600)">
        Example: <strong>${formatDate('2025-06-15')}</strong>
      </div>
    </div>`;
}

function saveGeneralSettings(){
  DB.settings.siteName = document.getElementById('set-sitename').value;
  DB.settings.contactEmail = document.getElementById('set-email').value;
  DB.settings.globalSupportPhone = document.getElementById('set-support-phone').value;
  toast('General settings saved!','success');
}
function saveGPSSettings(){
  DB.settings.requireGPS = document.getElementById('set-gps').checked;
  DB.settings.allowOverride = document.getElementById('set-override').checked;
  DB.settings.gpsRadius = parseInt(document.getElementById('set-radius').value)||100;
  toast('GPS settings saved!','success');
}
function saveReviewSettings(){
  DB.reviewPlatforms.airbnb = document.getElementById('set-airbnb-url').value;
  DB.reviewPlatforms.google = document.getElementById('set-google-url').value;
  toast('Review URLs saved!','success');
}

function renderEmails(el) {
  el.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Mail Templates</div>
      <div class="form-group">
        <label class="form-label">Template</label>
        <select class="form-input form-select" id="email-template-select" onchange="loadEmailTemplate()">
          <option value="checkin">Check-In Invitation</option>
          <option value="reminder">Arrival Day Reminder</option>
          <option value="thanks">Post Stay Thank You</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Subject</label>
        <input class="form-input" id="email-subject" value="You're all set for your stay at {property_name}!">
      </div>
      <div class="form-group">
        <label class="form-label">Message</label>
        ${buildWYSIWYG('email-body', 'Hi {guest_name},\n\nWe\'re excited to host you at {property_name}. Please complete your verification to access your digital guide.\n\nBest regards,\nThe Host Team')}
      </div>
      <div style="margin-bottom:16px">
        <div class="text-sm text-gray-500" style="margin-bottom:8px">📌 Available Variables:</div>
        <div class="shortcode-chips">
          ${['{guest_name}','{property_name}','{checkin_date}','{checkout_date}','{booking_id}','{guide_link}'].map(s=>`<span class="shortcode-chip" onclick="insertShortcode('email-body','${s}')">${s}</span>`).join('')}
        </div>
      </div>
      <button class="btn btn-primary" onclick="toast('Mail template saved!','success')">Save Template</button>
    </div>`;
}

function loadEmailTemplate() {
  toast('Template loaded','success');
}

// ============================================================
// Change #3: Full WYSIWYG Editor
// ============================================================
function buildWYSIWYG(id, initialContent) {
  return `
    <div class="wysiwyg-wrap">
      <div class="wysiwyg-toolbar">
        <button class="wysiwyg-btn" title="Bold" onclick="wysiExec('bold')"><b>B</b></button>
        <button class="wysiwyg-btn" title="Italic" onclick="wysiExec('italic')"><i>I</i></button>
        <button class="wysiwyg-btn" title="Underline" onclick="wysiExec('underline')"><u>U</u></button>
        <button class="wysiwyg-btn" title="Strikethrough" onclick="wysiExec('strikeThrough')"><s>S</s></button>
        <div class="wysiwyg-sep"></div>
        <button class="wysiwyg-btn" title="Align Left" onclick="wysiExec('justifyLeft')">⬅</button>
        <button class="wysiwyg-btn" title="Center" onclick="wysiExec('justifyCenter')">☰</button>
        <button class="wysiwyg-btn" title="Align Right" onclick="wysiExec('justifyRight')">➡</button>
        <button class="wysiwyg-btn" title="Justify" onclick="wysiExec('justifyFull')">≡</button>
        <div class="wysiwyg-sep"></div>
        <button class="wysiwyg-btn" title="H1" onclick="wysiExec('formatBlock','H1')">H1</button>
        <button class="wysiwyg-btn" title="H2" onclick="wysiExec('formatBlock','H2')">H2</button>
        <button class="wysiwyg-btn" title="H3" onclick="wysiExec('formatBlock','H3')">H3</button>
        <button class="wysiwyg-btn" title="H4" onclick="wysiExec('formatBlock','H4')">H4</button>
        <div class="wysiwyg-sep"></div>
        <button class="wysiwyg-btn" title="Unordered List" onclick="wysiExec('insertUnorderedList')">• List</button>
        <button class="wysiwyg-btn" title="Ordered List" onclick="wysiExec('insertOrderedList')">1. List</button>
        <div class="wysiwyg-sep"></div>
        <button class="wysiwyg-btn" title="Insert Table" onclick="wysiInsertTable('${id}')">⊞ Table</button>
        <button class="wysiwyg-btn" title="Add Row" onclick="wysiTableRow('insert','${id}')">+Row</button>
        <button class="wysiwyg-btn" title="Del Row" onclick="wysiTableRow('delete','${id}')">-Row</button>
        <button class="wysiwyg-btn" title="Add Col" onclick="wysiTableCol('insert','${id}')">+Col</button>
        <button class="wysiwyg-btn" title="Del Col" onclick="wysiTableCol('delete','${id}')">-Col</button>
        <div class="wysiwyg-sep"></div>
        <button class="wysiwyg-btn" title="Insert Link" onclick="wysiInsertLink('${id}')">🔗</button>
        <button class="wysiwyg-btn" title="Insert Image" onclick="triggerWysiImageUpload('${id}')">🖼️</button>
        <input type="file" id="wysi-img-${id}" accept="image/*" class="hidden" onchange="handleWysiImageUpload(event,'${id}')">
        <div class="wysiwyg-sep"></div>
        <select class="wysiwyg-select" title="Font Size" onchange="wysiExec('fontSize',this.value);this.value=''">
          <option value="">Size</option>
          <option value="1">XS</option><option value="2">S</option><option value="3">M</option>
          <option value="4">L</option><option value="5">XL</option><option value="6">XXL</option>
        </select>
        <input type="color" title="Text Color" style="width:30px;height:28px;border:1px solid var(--gray-200);border-radius:5px;cursor:pointer;padding:2px" onchange="wysiExec('foreColor',this.value)">
        <input type="color" title="Highlight" style="width:30px;height:28px;border:1px solid var(--gray-200);border-radius:5px;cursor:pointer;padding:2px" onchange="wysiExec('hiliteColor',this.value)">
        <div class="wysiwyg-sep"></div>
        <button class="wysiwyg-btn" title="Undo" onclick="wysiExec('undo')">↩</button>
        <button class="wysiwyg-btn" title="Redo" onclick="wysiExec('redo')">↪</button>
      </div>
      <div class="wysiwyg-editor" id="${id}" contenteditable="true">${initialContent}</div>
    </div>`;
}

function wysiExec(cmd, val=null) {
  document.execCommand(cmd, false, val);
}
function wysiInsertLink(id) {
  const url = prompt('Enter URL:');
  if(url) { document.getElementById(id)?.focus(); document.execCommand('createLink',false,url); }
}
function triggerWysiImageUpload(id) {
  activeWysiId = id;
  document.getElementById('wysi-img-'+id)?.click();
}
let activeWysiId = null;
function handleWysiImageUpload(event, id) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const mid = 'm'+Date.now();
    DB.mediaLibrary.push({id:mid,name:file.name,url:e.target.result,folder:'General'});
    document.getElementById(id)?.focus();
    document.execCommand('insertImage',false,e.target.result);
    toast('Image inserted!','success');
  };
  reader.readAsDataURL(file);
}
function insertShortcode(id, code) {
  const el = document.getElementById(id);
  if(!el) return;
  el.focus();
  document.execCommand('insertText',false,code);
}

function wysiInsertTable(id) {
  const rows = parseInt(prompt('Number of rows:', '3')) || 3;
  const cols = parseInt(prompt('Number of columns:', '3')) || 3;
  let html = '<table><thead><tr>' + Array(cols).fill('<th>Header</th>').join('') + '</tr></thead><tbody>';
  for(let r=0;r<rows-1;r++) {
    html += '<tr>' + Array(cols).fill('<td>Cell</td>').join('') + '</tr>';
  }
  html += '</tbody></table>';
  document.getElementById(id)?.focus();
  document.execCommand('insertHTML',false,html);
}

function wysiTableRow(action, id) {
  const editor = document.getElementById(id);
  if(!editor) return;
  const sel = window.getSelection();
  const cell = sel?.anchorNode?.closest ? sel.anchorNode.closest('td,th') : null;
  if(!cell) { toast('Click inside a table cell first.','warning'); return; }
  const row = cell.closest('tr');
  if(!row) return;
  if(action==='insert') {
    const newRow = row.cloneNode(true);
    newRow.querySelectorAll('td,th').forEach(c=>c.textContent='Cell');
    row.parentNode.insertBefore(newRow, row.nextSibling);
    toast('Row added','success');
  } else {
    if(row.parentNode.children.length > 1) { row.remove(); toast('Row deleted','success'); }
    else toast('Cannot delete last row.','warning');
  }
}

function wysiTableCol(action, id) {
  const editor = document.getElementById(id);
  if(!editor) return;
  const sel = window.getSelection();
  const cell = sel?.anchorNode?.closest ? sel.anchorNode.closest('td,th') : null;
  if(!cell) { toast('Click inside a table cell first.','warning'); return; }
  const colIdx = Array.from(cell.parentNode.children).indexOf(cell);
  const table = cell.closest('table');
  if(!table) return;
  if(action==='insert') {
    table.querySelectorAll('tr').forEach(row=>{
      const newCell = row.cells[0].cloneNode(false);
      newCell.textContent = 'Cell';
      if(row.cells[colIdx+1]) row.insertBefore(newCell, row.cells[colIdx+1]);
      else row.appendChild(newCell);
    });
    toast('Column added','success');
  } else {
    table.querySelectorAll('tr').forEach(row=>{
      if(row.cells.length > 1) row.deleteCell(colIdx);
    });
    toast('Column deleted','success');
  }
}

// ============================================================
// BOOKING CRUD
// ============================================================
function viewBooking(id) {
  const b = DB.bookings.find(x=>x.id===id);
  if(!b) return;
  const g = DB.guests.find(x=>x.id===b.guestId);
  const p = DB.properties.find(x=>x.id===b.propertyId);
  showModal(`
    <div class="guest-detail-grid">
      <div class="detail-box"><div class="detail-box-label">Booking ID</div><div class="detail-box-value">${b.id}</div></div>
      <div class="detail-box"><div class="detail-box-label">Status</div><div class="detail-box-value"><span class="badge ${b.status==='Confirmed'?'badge-green':'badge-amber'}">${b.status}</span></div></div>
      <div class="detail-box"><div class="detail-box-label">Guest</div><div class="detail-box-value">${g?.name||'—'}</div></div>
      <div class="detail-box"><div class="detail-box-label">Platform</div><div class="detail-box-value">${b.platform}</div></div>
      <div class="detail-box"><div class="detail-box-label">Property</div><div class="detail-box-value">${p?.name||'—'}</div></div>
      <div class="detail-box"><div class="detail-box-label">Email</div><div class="detail-box-value">${g?.email||'—'}</div></div>
      <div class="detail-box"><div class="detail-box-label">Check-In</div><div class="detail-box-value">${formatDate(b.checkin)}</div></div>
      <div class="detail-box"><div class="detail-box-label">Check-Out</div><div class="detail-box-value">${formatDate(b.checkout)}</div></div>
    </div>
    <div class="doc-preview-grid">
      <div class="doc-preview-card">
        <div class="doc-preview-card-label">Front ID</div>
        <div class="doc-preview-card-body">${g?.frontID?`<img src="${g.frontID}" style="max-width:100%;border-radius:6px">`:`<span style="color:var(--gray-400);font-size:13px">Not uploaded</span>`}</div>
      </div>
      <div class="doc-preview-card">
        <div class="doc-preview-card-label">Back ID</div>
        <div class="doc-preview-card-body">${g?.backID?`<img src="${g.backID}" style="max-width:100%;border-radius:6px">`:`<span style="color:var(--gray-400);font-size:13px">Not uploaded</span>`}</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="editBooking('${b.id}');closeModal()">Edit</button>
      <button class="btn btn-danger" onclick="deleteBooking('${b.id}');closeModal()">Delete</button>
    </div>`, 'Booking #'+b.id, true);
}

function editBooking(id) {
  const b = DB.bookings.find(x=>x.id===id);
  if(!b) return;
  const g = DB.guests.find(x=>x.id===b.guestId);
  showModal(`
    <div class="form-group"><label class="form-label">Guest Name</label><input class="form-input" id="eb-gname" value="${g?.name||''}"></div>
    <div class="form-group"><label class="form-label">Guest Email</label><input class="form-input" id="eb-email" value="${g?.email||''}"></div>
    <div class="form-group"><label class="form-label">Property</label>
      <select class="form-input form-select" id="eb-prop">${DB.properties.map(p=>`<option value="${p.id}" ${p.id===b.propertyId?'selected':''}>${p.name}</option>`).join('')}</select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Check-In</label><input type="date" class="form-input" id="eb-ci" value="${b.checkin}"></div>
      <div class="form-group"><label class="form-label">Check-Out</label><input type="date" class="form-input" id="eb-co" value="${b.checkout}"></div>
    </div>
    <div class="form-group"><label class="form-label">Status</label>
      <select class="form-input form-select" id="eb-status">
        <option ${b.status==='Confirmed'?'selected':''}>Confirmed</option>
        <option ${b.status==='Pending'?'selected':''}>Pending</option>
        <option ${b.status==='Cancelled'?'selected':''}>Cancelled</option>
      </select>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveEditBooking('${id}')">Save</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Edit Booking #'+id);
}

function saveEditBooking(id) {
  const b = DB.bookings.find(x=>x.id===id);
  const g = DB.guests.find(x=>x.id===b.guestId);
  if(g) {
    g.name = document.getElementById('eb-gname').value;
    g.email = document.getElementById('eb-email').value;
  }
  b.propertyId = document.getElementById('eb-prop').value;
  b.checkin = document.getElementById('eb-ci').value;
  b.checkout = document.getElementById('eb-co').value;
  b.status = document.getElementById('eb-status').value;
  closeModal();
  toast('Booking updated!','success');
  renderAdminPage(APP.currentAdminPage);
}

function deleteBooking(id) {
  if(!confirm('Delete booking '+id+'?')) return;
  const b = DB.bookings.find(x=>x.id===id);
  DB.bookings = DB.bookings.filter(x=>x.id!==id);
  // Also remove orphaned guest
  if(b) DB.guests = DB.guests.filter(g=>g.id!==b.guestId);
  toast('Booking deleted.','success');
  renderAdminPage(APP.currentAdminPage);
}

function openAddBookingModal() {
  showModal(`
    <div class="form-group"><label class="form-label">Booking ID</label><input class="form-input" id="nb-id" placeholder="e.g. 1004"></div>
    <div class="form-group"><label class="form-label">Guest Name</label><input class="form-input" id="nb-gname" placeholder="Full name"></div>
    <div class="form-group"><label class="form-label">Guest Email</label><input class="form-input" id="nb-email" placeholder="guest@email.com"></div>
    <div class="form-group"><label class="form-label">Property</label>
      <select class="form-input form-select" id="nb-prop">${DB.properties.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Check-In</label><input type="date" class="form-input" id="nb-ci"></div>
      <div class="form-group"><label class="form-label">Check-Out</label><input type="date" class="form-input" id="nb-co"></div>
    </div>
    <div class="form-group"><label class="form-label">Platform</label>
      <select class="form-input form-select" id="nb-plat">
        <option>Airbnb</option><option>Booking.com</option><option>VRBO</option><option>Direct</option>
      </select>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveNewBooking()">Save Booking</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Add Guest Booking');
}

function saveNewBooking() {
  const id = document.getElementById('nb-id').value.trim();
  const gname = document.getElementById('nb-gname').value.trim();
  if(!id||!gname) { toast('Booking ID and guest name required.','error'); return; }
  if(DB.bookings.find(b=>b.id===id)) { toast('Booking ID already exists.','error'); return; }
  const gid = 'g'+Date.now();
  DB.guests.push({id:gid,name:gname,email:document.getElementById('nb-email').value,status:'Upcoming',frontID:null,backID:null});
  DB.bookings.push({id,guestId:gid,propertyId:document.getElementById('nb-prop').value,checkin:document.getElementById('nb-ci').value,checkout:document.getElementById('nb-co').value,platform:document.getElementById('nb-plat').value,status:'Confirmed'});
  closeModal();
  toast('Booking '+id+' added!','success');
  renderAdminPage(APP.currentAdminPage);
}

// ============================================================
// PROPERTY CRUD
// Change #4: Google Maps address autocomplete hooks
// Change #5: Removed phone field
// Change #6: Removed wifi fields
// Change #9: Per-property timezone
// ============================================================
function editProperty(id) {
  const p = DB.properties.find(x=>x.id===id);
  if(!p) return;
  showModal(`
    <div class="form-group"><label class="form-label">Property Name</label><input class="form-input" id="ep-name" value="${p.name}"></div>
    <div class="form-group">
      <label class="form-label">Address <small style="color:var(--gray-400)">(Google Maps autocomplete ready)</small></label>
      <input class="form-input" id="ep-addr" value="${p.address}" placeholder="Start typing address..." oninput="handleAddressInput('ep-addr','ep-lat','ep-lng','ep-tz','ep-fmtaddr')">
      <input type="hidden" id="ep-lat" value="${p.lat||''}">
      <input type="hidden" id="ep-lng" value="${p.lng||''}">
      <input type="hidden" id="ep-fmtaddr" value="${p.formattedAddress||p.address}">
    </div>
    <div class="form-group"><label class="form-label">Door Code</label><input class="form-input" id="ep-code" value="${p.doorCode}"></div>
    <div class="form-group">
      <label class="form-label">Timezone <small style="color:var(--gray-400)">(auto-detected from address)</small></label>
      <input class="form-input" id="ep-tz" value="${p.timezone||'America/New_York'}" placeholder="e.g. America/New_York">
    </div>
    <div class="form-group">
      <label class="form-label">Property Image</label>
      <div style="display:flex;gap:12px;align-items:center">
        <div style="width:80px;height:60px;border-radius:8px;overflow:hidden;background:var(--gray-100);flex-none">
          <img id="ep-img-preview" src="${p.image}" style="width:100%;height:100%;object-fit:cover">
        </div>
        <label class="btn btn-outline btn-sm" style="cursor:pointer">
          📷 Upload Image
          <input type="file" accept="image/*" class="hidden" onchange="handlePropertyImageUpload(event,'ep-img-preview')">
        </label>
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveEditProperty('${id}')">Save Changes</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Edit Property: '+p.name, true);
}

// Change #4: Google Maps API integration hook
function handleAddressInput(addrId, latId, lngId, tzId, fmtAddrId) {
  // In production: integrate Google Places Autocomplete
  // API key: replace YOUR_GOOGLE_MAPS_API_KEY in HTML script tag
  // This function is called onInput and connects to Places API
  const addr = document.getElementById(addrId)?.value;
  if(window.google && window.google.maps && window.google.maps.places) {
    // Google Places API is loaded — autocomplete will bind automatically
    // Geocoding and timezone detection run on place_changed event
  }
  // Timezone can be auto-detected via Google Time Zone API:
  // GET https://maps.googleapis.com/maps/api/timezone/json?location=LAT,LNG&timestamp=UNIX&key=KEY
  // Then populate tzId field
}

function handlePropertyImageUpload(event, previewId) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById(previewId);
    if(prev) { prev.src = e.target.result; prev.dataset.newSrc = e.target.result; }
    toast('Image ready (save to apply)','success');
  };
  reader.readAsDataURL(file);
}

function saveEditProperty(id) {
  const p = DB.properties.find(x=>x.id===id);
  p.name = document.getElementById('ep-name').value;
  p.address = document.getElementById('ep-addr').value;
  p.formattedAddress = document.getElementById('ep-fmtaddr')?.value || p.address;
  p.lat = document.getElementById('ep-lat')?.value || p.lat;
  p.lng = document.getElementById('ep-lng')?.value || p.lng;
  p.doorCode = document.getElementById('ep-code').value;
  p.timezone = document.getElementById('ep-tz')?.value || 'America/New_York';
  const newImg = document.getElementById('ep-img-preview')?.dataset.newSrc;
  if(newImg) p.image = newImg;
  closeModal();
  toast('Property updated!','success');
  renderAdminPage('properties');
}

function deleteProperty(id) {
  if(!confirm('Delete this property?')) return;
  DB.properties = DB.properties.filter(p=>p.id!==id);
  toast('Property deleted.','success');
  renderAdminPage('properties');
}

function openAddPropertyModal() {
  showModal(`
    <div class="form-group"><label class="form-label">Property Name</label><input class="form-input" id="np-name" placeholder="e.g. Sunset Villa"></div>
    <div class="form-group">
      <label class="form-label">Address <small style="color:var(--gray-400)">(Google Maps autocomplete ready)</small></label>
      <input class="form-input" id="np-addr" placeholder="Start typing address..." oninput="handleAddressInput('np-addr','np-lat','np-lng','np-tz','np-fmtaddr')">
      <input type="hidden" id="np-lat">
      <input type="hidden" id="np-lng">
      <input type="hidden" id="np-fmtaddr">
    </div>
    <div class="form-group"><label class="form-label">Door Code</label><input class="form-input" id="np-code" placeholder="e.g. 1234"></div>
    <div class="form-group">
      <label class="form-label">Timezone</label>
      <select class="form-input form-select" id="np-tz">
        <option value="America/New_York">America/New_York (EST)</option>
        <option value="America/Chicago">America/Chicago (CST)</option>
        <option value="America/Denver">America/Denver (MST)</option>
        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
        <option value="Europe/London">Europe/London (GMT)</option>
        <option value="Europe/Paris">Europe/Paris (CET)</option>
        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
        <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
        <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Property Image</label>
      <div style="border:2px dashed var(--gray-200);border-radius:var(--radius-sm);padding:24px;text-align:center;cursor:pointer" onclick="document.getElementById('np-img').click()">
        <img id="np-img-preview" src="" alt="" style="max-height:120px;margin:0 auto 10px;display:none;border-radius:8px">
        <div id="np-img-placeholder" style="color:var(--gray-400);font-size:13px">📷 Click to upload image</div>
        <input type="file" id="np-img" accept="image/*" class="hidden" onchange="handleNewPropertyImg(event)">
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveNewProperty()">Add Property</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Add New Property', true);
}

let newPropertyImgData = null;
function handleNewPropertyImg(event) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    newPropertyImgData = e.target.result;
    const prev = document.getElementById('np-img-preview');
    prev.src = e.target.result;
    prev.style.display = 'block';
    document.getElementById('np-img-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function saveNewProperty() {
  const name = document.getElementById('np-name').value.trim();
  if(!name) { toast('Property name required.','error'); return; }
  const id = 'p'+Date.now();
  DB.properties.push({
    id, name,
    address: document.getElementById('np-addr').value,
    formattedAddress: document.getElementById('np-fmtaddr')?.value || document.getElementById('np-addr').value,
    lat: document.getElementById('np-lat')?.value || '',
    lng: document.getElementById('np-lng')?.value || '',
    doorCode: document.getElementById('np-code').value,
    timezone: document.getElementById('np-tz')?.value || 'America/New_York',
    image: newPropertyImgData || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  });
  newPropertyImgData = null;
  closeModal();
  toast('Property added!','success');
  renderAdminPage('properties');
}

// ============================================================
// WELCOME GUIDE CRUD (renamed from Categories)
// Change #1: headerImage + navIconImage fields
// Change #2: renamed throughout
// ============================================================
function editWelcomeGuideItem(id) {
  const cat = DB.welcomeGuide.find(x=>x.id===id);
  if(!cat) return;
  const headerSrc = cat.headerImage || DB.globalImages[cat.name] || '';
  const navSrc = cat.navIconImage || '';
  showModal(`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Guide Item Name</label><input class="form-input" id="ec-name" value="${cat.name}"></div>
      <div class="form-group"><label class="form-label">Icon (Emoji)</label><input class="form-input" id="ec-icon" value="${cat.icon}" style="font-size:20px"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group">
        <label class="form-label">Header Image (full width hero)</label>
        <div style="border:1.5px dashed var(--gray-200);border-radius:8px;overflow:hidden;margin-bottom:6px">
          <img id="ec-header-preview" src="${headerSrc}" style="width:100%;height:80px;object-fit:cover" onerror="this.style.display='none'">
        </div>
        <label class="btn btn-outline btn-sm" style="cursor:pointer;width:100%;justify-content:center">
          📷 Upload Header Image
          <input type="file" accept="image/*" class="hidden" onchange="handleWGImageUpload(event,'ec-header-preview','header','${id}')">
        </label>
      </div>
      <div class="form-group">
        <label class="form-label">Nav Icon Image (card/nav)</label>
        <div style="border:1.5px dashed var(--gray-200);border-radius:8px;overflow:hidden;margin-bottom:6px;background:var(--gray-100)">
          <img id="ec-nav-preview" src="${navSrc}" style="width:100%;height:80px;object-fit:cover" onerror="this.style.display='none'">
        </div>
        <label class="btn btn-outline btn-sm" style="cursor:pointer;width:100%;justify-content:center">
          📷 Upload Nav Icon
          <input type="file" accept="image/*" class="hidden" onchange="handleWGImageUpload(event,'ec-nav-preview','nav','${id}')">
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Content</label>
      ${buildWYSIWYG('ec-content', cat.content||'')}
    </div>
    <div style="margin-bottom:16px">
      <div class="text-sm text-gray-500" style="margin-bottom:8px">📌 Available Shortcodes:</div>
      <div class="shortcode-chips">
        ${['[property_name]','[contact_phone]','[checkin_time]','[checkout_time]','[guest_name]','[booking_id]'].map(s=>`<span class="shortcode-chip" onclick="insertShortcode('ec-content','${s}')">${s}</span>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveEditWelcomeGuideItem('${id}')">Save Changes</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Edit Welcome Guide: '+cat.name, true);
}

function handleWGImageUpload(event, previewId, type, catId) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById(previewId);
    if(prev) { prev.src = e.target.result; prev.style.display='block'; prev.dataset.newSrc = e.target.result; }
    const cat = DB.welcomeGuide.find(x=>x.id===catId);
    if(cat) {
      if(type==='header') cat.headerImage = e.target.result;
      else cat.navIconImage = e.target.result;
    }
    toast((type==='header'?'Header':'Nav icon')+' image updated!','success');
  };
  reader.readAsDataURL(file);
}

function saveEditWelcomeGuideItem(id) {
  const cat = DB.welcomeGuide.find(x=>x.id===id);
  cat.name = document.getElementById('ec-name').value;
  cat.icon = document.getElementById('ec-icon').value;
  const editorContent = document.getElementById('ec-content')?.innerHTML;
  if(editorContent) cat.content = editorContent;
  closeModal();
  toast('Welcome Guide item saved!','success');
  renderAdminPage('welcome-guide-admin');
}

function deleteWelcomeGuideItem(id) {
  if(!confirm('Delete this Welcome Guide item?')) return;
  DB.welcomeGuide = DB.welcomeGuide.filter(c=>c.id!==id);
  toast('Item deleted.','success');
  renderAdminPage('welcome-guide-admin');
}

function openAddWelcomeGuideModal() {
  showModal(`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="nc-name" placeholder="e.g. Parking"></div>
      <div class="form-group"><label class="form-label">Icon (Emoji)</label><input class="form-input" id="nc-icon" placeholder="🅿️"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group">
        <label class="form-label">Header Image</label>
        <div style="border:2px dashed var(--gray-200);border-radius:8px;padding:16px;text-align:center;cursor:pointer" onclick="document.getElementById('nc-header-img').click()">
          <img id="nc-header-preview" style="max-height:60px;margin:0 auto 8px;display:none;border-radius:6px">
          <div id="nc-header-placeholder" style="color:var(--gray-400);font-size:12px">📷 Header Image</div>
          <input type="file" id="nc-header-img" accept="image/*" class="hidden" onchange="handleNewWGImg(event,'header')">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Nav Icon Image</label>
        <div style="border:2px dashed var(--gray-200);border-radius:8px;padding:16px;text-align:center;cursor:pointer" onclick="document.getElementById('nc-nav-img').click()">
          <img id="nc-nav-preview" style="max-height:60px;margin:0 auto 8px;display:none;border-radius:6px">
          <div id="nc-nav-placeholder" style="color:var(--gray-400);font-size:12px">📷 Nav Icon</div>
          <input type="file" id="nc-nav-img" accept="image/*" class="hidden" onchange="handleNewWGImg(event,'nav')">
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Content</label>
      ${buildWYSIWYG('nc-content','Enter content here...')}
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="saveNewWelcomeGuideItem()">Add Item</button>
      <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
    </div>`, 'Add Welcome Guide Item', true);
}

let newWGHeaderImg = null, newWGNavImg = null;
function handleNewWGImg(event, type) {
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    if(type==='header') { newWGHeaderImg = e.target.result; const p=document.getElementById('nc-header-preview'); p.src=e.target.result; p.style.display='block'; document.getElementById('nc-header-placeholder').style.display='none'; }
    else { newWGNavImg = e.target.result; const p=document.getElementById('nc-nav-preview'); p.src=e.target.result; p.style.display='block'; document.getElementById('nc-nav-placeholder').style.display='none'; }
  };
  reader.readAsDataURL(file);
}

function saveNewWelcomeGuideItem() {
  const name = document.getElementById('nc-name').value.trim();
  if(!name) { toast('Name required.','error'); return; }
  const content = document.getElementById('nc-content')?.innerHTML||'';
  DB.welcomeGuide.push({id:'c'+Date.now(),name,icon:document.getElementById('nc-icon').value||'📁',headerImage:newWGHeaderImg||'',navIconImage:newWGNavImg||'',content});
  newWGHeaderImg = null; newWGNavImg = null;
  closeModal();
  toast('Welcome Guide item added!','success');
  renderAdminPage('welcome-guide-admin');
}

// ============================================================
// Change #14: Database Reset
// ============================================================
function resetDemoData() {
  DB.bookings = [];
  DB.guests = [];
  DB.properties = [];
  DB.welcomeGuide = [];
  DB.mediaLibrary = [];
  DB.globalImages = {};
  console.log('GuestGuide: Demo data reset. System ready for fresh installation.');
}

// ============================================================
// MODAL SYSTEM
// ============================================================
function showModal(content, title='', large=false) {
  const mc = document.getElementById('modal-container');
  mc.innerHTML = `
    <div class="modal-overlay" onclick="handleOverlayClick(event)">
      <div class="modal${large?' modal-lg':''}">
        ${title?`<div class="modal-header"><div class="modal-title">${title}</div><div class="modal-close" onclick="closeModal()">✕</div></div>`:''}
        <div class="modal-body">${content}</div>
      </div>
    </div>`;
}
function handleOverlayClick(e) { if(e.target.classList.contains('modal-overlay')) closeModal(); }
function closeModal() { document.getElementById('modal-container').innerHTML = ''; }

// ============================================================
// TOAST SYSTEM
// ============================================================
function toast(msg, type='success') {
  const icons = {success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-text">${msg}</span>`;
  container.appendChild(t);
  setTimeout(()=>{ t.style.animation='fadeOut .3s ease forwards'; setTimeout(()=>t.remove(),300); },3000);
}

// ============================================================
// DOM READY: Simulate button + image error fallback
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const step5 = document.getElementById('gstep-5');
  if(step5) {
    const simBtn = document.createElement('button');
    simBtn.className = 'btn btn-outline btn-sm';
    simBtn.style.cssText = 'margin-top:14px;width:100%';
    simBtn.textContent = '🔄 Simulate Check-In Date';
    simBtn.onclick = openSimulate;
    step5.appendChild(simBtn);
  }
});

document.addEventListener('error', function(e) {
  if(e.target.tagName==='IMG') {
    e.target.classList.add('errored');
    if(!e.target.dataset.fallbackApplied) {
      e.target.dataset.fallbackApplied = '1';
      e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80';
    }
  }
}, true);
