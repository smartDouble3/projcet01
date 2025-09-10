// ===== Local Storage Helpers =====
const LS = { USERS: 'APP_USERS', CURRENT: 'APP_CURRENT_USER' };
const loadUsers   = () => JSON.parse(localStorage.getItem(LS.USERS)   || '[]');
const saveUsers   = (arr) => localStorage.setItem(LS.USERS, JSON.stringify(arr));
const getCurrent  = () => JSON.parse(localStorage.getItem(LS.CURRENT) || 'null');
const setCurrent  = (u) => localStorage.setItem(LS.CURRENT, JSON.stringify(u));
const clearCurrent = () => localStorage.removeItem(LS.CURRENT);

// ===== Seed Data (ครั้งแรก) =====
const SVG_BLUE  = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSI2MCIgZmlsbD0iIzE3QTJCOCIvPjxzdmcgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMi43IDEyLjFMMTMuNiAxLjJDMTMgMC40IDEyIDAuNCAxMS40IDEuMkwyLjMgMTIuMUMxLjkgMTIuNiAxLjkgMTMuNCAyLjMgMTMuOUwxMS40IDIyLjhDMTIgMjMuNiAxMyAyMy42IDEzLjYgMjIuOEwyMi43IDEzLjlDMjMuMSAxMy40IDIzLjEgMTIuNiAyMi43IDEyLjFaTTEyIDE4SDEyVjZIMTJWMThaIi8+PC9zdmc+PC9zdmc+";
const SVG_GREEN = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSI2MCIgZmlsbD0iIzZGNDJDMSIvPjxzdmcgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xNS45IDVIOC4xQzYuNzUgNSA1LjY2IDYuMDkgNS42NiA3LjQ0TDUgMTYuNUM1IDE3Ljg1IDYuMDkgMTguOTQgNy40NCAxOC45NEgxNi41NkMxNy45MSAxOC45NCAxOSAxNy44NSAxOSAxNi41VjcuNDRDMTkgNi4wOSAxNy45MSA1IDE2LjU2IDVIMTUuOVpNOSA3LjVIMTVWMTBIOVY3LjVaTTkgMTEuNUgxNVYxMy41SDlWMTEuNVpNOSAxNS41SDE1VjE3SDlWMTUuNVoiLz48L3N2Zz48L3N2Zz4";

const defaultUsers = [
  { name: "ทิพย์สุดา ตุพิลา", email: "admin@example.com",   password: "admin123", phone: "0800000000", role: "admin", profileImage: "/S__24346630_0.jpg" },
  { name: "ธิติมา -",        email: "it@example.com",      password: "it123",    phone: "0801234567", role: "staff", profileImage: "/S__24346632_0.jpg" }
];

let users = loadUsers();
if (users.length === 0) { users = defaultUsers; saveUsers(users); }
let currentUser = getCurrent();
let tempProfileImage = null;

// ===== UI helpers =====
function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function switchToSignUp(){
  hide(document.getElementById('loginForm'));
  show(document.getElementById('signUpForm'));
  hide(document.getElementById('dashboard'));
  clearMessages(); resetProfilePic();
}
function switchToLogin(){
  hide(document.getElementById('signUpForm'));
  show(document.getElementById('loginForm'));
  hide(document.getElementById('dashboard'));
  clearMessages();
}
function showDashboard(){
  hide(document.getElementById('loginForm'));
  hide(document.getElementById('signUpForm'));
  show(document.getElementById('dashboard'));
  updateUserInfo(); updateUsersList(); updateStaffGallery();
}
function clearMessages(){
  document.getElementById('loginMessage').innerHTML = '';
  document.getElementById('signUpMessage').innerHTML = '';
}
function showMessage(elementId, message, isSuccess=false){
  const cls = isSuccess ? 'success-message' : 'error-message';
  document.getElementById(elementId).innerHTML = `<div class="${cls}">${message}</div>`;
}
function resetProfilePic(){ document.getElementById('signUpProfilePic').src = SVG_BLUE; tempProfileImage = null; }
function handleProfileImageUpload(event, imgId){
  const file = event.target.files?.[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{ const img=document.getElementById(imgId); img.src = e.target.result; tempProfileImage = e.target.result; };
  reader.readAsDataURL(file);
}
function getRoleText(role){ if(role==='admin')return'ผู้ดูแลระบบ'; if(role==='staff')return'เจ้าหน้าที่ IT'; return'ผู้ใช้งาน'; }

// ===== Auth: Login / SignUp / Logout =====
document.getElementById('emailFrom').addEventListener('submit', (e)=>{
  e.preventDefault(); users = loadUsers();
  const email = document.getElementById('E_mail_login').value.trim();
  const password = document.getElementById('Password_login').value;
  const user = users.find(u=>u.email===email && u.password===password);
  if(user){ currentUser=user; setCurrent(user); showMessage('loginMessage','เข้าสู่ระบบสำเร็จ!',true); setTimeout(showDashboard, 500); }
  else { showMessage('loginMessage','อีเมลหรือรหัสผ่านไม่ถูกต้อง'); }
});

document.getElementById('signUpFormElement').addEventListener('submit', (e)=>{
  e.preventDefault(); users = loadUsers();
  const confirmPassword = document.getElementById('password_ss').value.trim();
  const name = document.getElementById('Name_sign').value.trim();
  const email = document.getElementById('E_mail_sign').value.trim();
  const password = document.getElementById('password_sign').value;
  const phone = document.getElementById('Tel_sign').value.trim();

  if(users.find(u=>u.email===email))   return showMessage('signUpMessage','อีเมลนี้ถูกใช้งานแล้ว');
  if(password.length<6)                return showMessage('signUpMessage','รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
  if(phone.length<10)                  return showMessage('signUpMessage','เบอร์โทรศัพท์ไม่ถูกต้อง');
  if(password!==confirmPassword)       return showMessage('signUpMessage','รหัสผ่านไม่ตรงกัน');

  const newUser = { name, email, password, phone, role:'user', profileImage: tempProfileImage || SVG_BLUE };
  users.push(newUser); saveUsers(users);
  showMessage('signUpMessage','สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ',true);
  document.getElementById('signUpFormElement').reset(); resetProfilePic();
  setTimeout(switchToLogin, 900);
});

function logout(){ currentUser=null; clearCurrent(); switchToLogin(); document.getElementById('emailFrom').reset(); }

// ===== Dashboard renderers =====
function updateUserInfo(){
  if(!currentUser) return;
  const el = document.getElementById('userInfo');
  el.innerHTML = `
    <div class="profile-picture-container">
      <img src="${currentUser.profileImage}" alt="Profile" class="profile-picture" />
    </div>
    <div class="sep"></div>
    <div class="user-item" style="background:#fff">
      <div class="user-info">
        <p><strong>ชื่อ:</strong> ${currentUser.name}</p>
        <p><strong>อีเมล:</strong> ${currentUser.email}</p>
        <p><strong>เบอร์โทรศัพท์:</strong> ${currentUser.phone}</p>
        <p><strong>สถานะ:</strong> <span class="role-badge role-${currentUser.role}">${getRoleText(currentUser.role)}</span></p>
      </div>
    </div>`;
  document.getElementById('usersListContainer').style.display = currentUser.role==='admin' ? 'block' : 'none';
}
function updateUsersList(){
  const list = document.getElementById('usersList'); list.innerHTML='';
  users.forEach((u)=>{
    const div = document.createElement('div'); div.className='user-item';
    div.innerHTML = `
      <img src="${u.profileImage}" class="avatar" alt="${u.name}" />
      <div class="user-info">
        <h4>${u.name}</h4>
        <p><strong>อีเมล:</strong> ${u.email}</p>
        <p><strong>เบอร์โทรศัพท์:</strong> ${u.phone}</p>
        <p><strong>สถานะ:</strong> <span class="role-badge role-${u.role}">${getRoleText(u.role)}</span></p>
      </div>`;
    list.appendChild(div);
  });
}
function updateStaffGallery(){
  const grid = document.getElementById('staffGrid'); grid.innerHTML='';
  const itStaff = users.filter(u=>u.role==='staff' || u.role==='admin');
  itStaff.forEach((s)=>{
    const card = document.createElement('div'); card.className='staff-card';
    card.innerHTML = `
      <img src="${s.profileImage}" alt="${s.name}" class="staff-avatar-large" />
      <div class="staff-name" style="margin-top:8px;font-weight:600">${s.name}</div>
      <div class="staff-role muted">${getRoleText(s.role)}</div>
      <div class="staff-contact">📧 ${s.email}</div>
      <div class="staff-contact">📞 ${s.phone}</div>`;
    grid.appendChild(card);
  });
}

// ===== Repair actions (demo) =====
function openRepairForm(){ alert('เปิดหน้าแจ้งซ่อม (demo) — ลิงก์ไปไฟล์ของจริงได้'); }
function openRepairHistory(){ alert('เปิดประวัติการซ่อม (demo) — ลิงก์ไปไฟล์ของจริงได้'); }

// ===== Export / Import =====
function exportJSON(){
  const payload = { users: loadUsers(), currentUser: getCurrent() };
  const blob = new Blob([JSON.stringify(payload,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'it-repair-data.json'; a.click(); URL.revokeObjectURL(url);
}
document.getElementById('importPicker').addEventListener('change', async (e)=>{
  const file = e.target.files?.[0]; if(!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data.users)) { saveUsers(data.users); users = data.users; }
    if (data.currentUser) { setCurrent(data.currentUser); currentUser = data.currentUser; }
    alert('นำเข้าข้อมูลสำเร็จ'); showDashboard();
  } catch { alert('ไฟล์ไม่ถูกต้อง'); }
  e.target.value = '';
});

// ===== Reset All =====
function resetAllData(){ localStorage.removeItem(LS.USERS); localStorage.removeItem(LS.CURRENT); alert('ล้างข้อมูลจำลองทั้งหมดแล้ว'); location.reload(); }

// ===== Initial mount =====
window.addEventListener('load', ()=>{
  console.log('ระบบ IT Repair System พร้อมใช้งาน');
  console.log('ผู้ใช้ทดสอบ: admin@example.com / admin123');
  console.log('ผู้ใช้ทดสอบ: it@example.com / it123');
  resetProfilePic();
  if(currentUser){ showDashboard(); }
});
