
        let users = [
            {
                name: "`ทิพย์สุดา ตุพิลา",
                email: "admin@example.com",
                password: "admin123",
                phone: "0800000000",
                role: "admin",
                profileImage: "/Projcet copy/img/S__24346630_0.jpg"
            },
            {
                name: "ธิติมา -",
                email: "it@example.com",
                password: "it123",
                phone: "0801234567",
                role: "staff",
                profileImage: "/Projcet copy/img/S__24346632_0.jpg"
            },
            {
                name: "ช่างเทคนิค",
                email: "tech@example.com",
                password: "tech123",
                phone: "0802345678",
                role: "staff",
                profileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiMxN0EyQjgiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0yMi43IDEyLjFMMTMuNiAxLjJDMTMgMC40IDEyIDAuNCAxMS40IDEuMkwyLjMgMTIuMUMxLjkgMTIuNiAxLjkgMTMuNCAyLjMgMTMuOUwxMS40IDIyLjhDMTIgMjMuNiAxMyAyMy42IDEzLjYgMjIuOEwyMi43IDEzLjlDMjMuMSAxMy40IDIzLjEgMTIuNiAyMi43IDEyLjFaTTEyIDE4SDEyVjZIMTJWMThaIi8+Cjwvc3ZnPgo8L3N2Zz4="
            },
            {
                name: "ผู้เชี่ยวชาญ Network",
                email: "network@example.com",
                password: "net123",
                phone: "0803456789",
                role: "staff",
                profileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiM2RjQyQzEiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xNS45IDVIOC4xQzYuNzUgNSA1LjY2IDYuMDkgNS42NiA3LjQ0TDUgMTYuNUM1IDE3Ljg1IDYuMDkgMTguOTQgNy40NCAxOC45NEgxNi41NkMxNy45MSAxOC45NCAxOSAxNy44NSAxOSAxNi41VjcuNDRDMTkgNi4wOSAxNy45MSA1IDE2LjU2IDVIMTUuOVpNOSA3LjVIMTVWMTBIOVY3LjVaTTkgMTEuNUgxNVYxMy41SDlWMTEuNVpNOSAxNS41SDE1VjE3SDlWMTUuNVoiLz4KPC9zdmc+Cjwvc3ZnPgo="
            }
        ];

        let currentUser = null;
        let tempProfileImage = null;

        function handleProfileImageUpload(event, imgId) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgElement = document.getElementById(imgId);
                    imgElement.src = e.target.result;
                    tempProfileImage = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }

        function switchToSignUp() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signUpForm').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            clearMessages();
            resetProfilePic();
        }

        function switchToLogin() {
            document.getElementById('signUpForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            clearMessages();
        }

        function showDashboard() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signUpForm').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            updateUserInfo();
            updateUsersList();
            updateStaffGallery();
        }

        function resetProfilePic() {
            document.getElementById('signUpProfilePic').src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTYwIDMwQzY2LjYyNzQgMzAgNzIgMzUuMzcyNiA3MiA0MkM3MiA0OC42Mjc0IDY2LjYyNzQgNTQgNjAgNTRDNTMuMzcyNiA1NCA0OCA0OC42Mjc0IDQ4IDQyQzQ4IDM1LjM3MjYgNTMuMzcyNiAzMCA2MCAzMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTM2IDkwQzM2IDc2Ljc0NTIgNDYuNzQ1MiA2NiA2MCA2NkM3My4yNTQ4IDY2IDg0IDc2Ljc0NTIgODQgOTBWOTZIMzZWOTBaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=";
            tempProfileImage = null;
        }


        function clearMessages() {
            document.getElementById('loginMessage').innerHTML = '';
            document.getElementById('signUpMessage').innerHTML = '';
        }

        function showMessage(elementId, message, isSuccess = false) {
            const messageClass = isSuccess ? 'success-message' : 'error-message';
            document.getElementById(elementId).innerHTML = `<div class="${messageClass}">${message}</div>`;
        }


        document.getElementById('emailFrom').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('E_mail_login').value;
            const password = document.getElementById('Password_login').value;

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                currentUser = user;
                showMessage('loginMessage', 'เข้าสู่ระบบสำเร็จ!', true);
                setTimeout(() => {
                    showDashboard();
                }, 1000);
            } else {
                showMessage('loginMessage', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        });
        document.getElementById('signUpFormElement').addEventListener('submit', function(e) {
            e.preventDefault();
            const confirmPassword = document.getElementById("password_ss").value.trim();
            const name = document.getElementById('Name_sign').value;
            const email = document.getElementById('E_mail_sign').value;
            const password = document.getElementById('password_sign').value;
            const phone = document.getElementById('Tel_sign').value;

            if (users.find(u => u.email === email)) {
                showMessage('signUpMessage', 'อีเมลนี้ถูกใช้งานแล้ว');
                return;
            }

            if (password.length < 6) {
                showMessage('signUpMessage', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
                return;
            }

            if (phone.length < 10) {
                showMessage('signUpMessage', 'เบอร์โทรศัพท์ไม่ถูกต้อง');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('signUpMessage', 'รหัสผ่านไม่ตรงกัน');
                return;
             }

            const newUser = { 
                name, 
                email, 
                password, 
                phone, 
                role: "user",
                profileImage: tempProfileImage || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiM2Qzc1N0QiLz4KPHBhdGggZD0iTTYwIDMwQzY2LjYyNzQgMzAgNzIgMzUuMzcyNiA3MiA0MkM3MiA0OC42Mjc0IDY2LjYyNzQgNTQgNjAgNTRDNTMuMzcyNiA1NCA0OCA0OC42Mjc0IDQ4IDQyQzQ4IDM1LjM3MjYgNTMuMzcyNiAzMCA2MCAzMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNiA5MEMzNiA3Ni43NDUyIDQ2Ljc0NTIgNjYgNjAgNjZDNzMuMjU0OCA2NiA4NCA3Ni43NDUyIDg0IDkwVjk2SDM2VjkwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"
            };
            users.push(newUser);

            showMessage('signUpMessage', 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', true);
            
            document.getElementById('signUpFormElement').reset();
            
            setTimeout(() => {
                switchToLogin();
            }, 2000);
        });

        function updateUserInfo() {
            if (currentUser) {
                document.getElementById('userInfo').innerHTML = `
                    <div class="profile-picture-container">
                        <img src="${currentUser.profileImage}" alt="Profile" class="profile-picture">
                    </div>
                    <div class="user-item">
                        <h4>ข้อมูลของคุณ</h4>
                        <p><strong>ชื่อ:</strong> ${currentUser.name}</p>
                        <p><strong>อีเมล:</strong> ${currentUser.email}</p>
                        <p><strong>เบอร์โทรศัพท์:</strong> ${currentUser.phone}</p>
                        <p><strong>สถานะ:</strong> <span class="role-badge role-${currentUser.role}">${getRoleText(currentUser.role)}</span></p>
                    </div>
                `;

                if (currentUser.role === 'admin') {
                    document.getElementById('usersListContainer').style.display = 'block';
                }
            }
        }

        function updateUsersList() {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            
            users.forEach((user, index) => {
                usersList.innerHTML += `
                    <div class="user-item">
                        <img src="${user.profileImage}" alt="${user.name}" class="user-avatar">
                        <div class="user-info">
                            <h4>${user.name}</h4>
                            <p><strong>อีเมล:</strong> ${user.email}</p>
                            <p><strong>เบอร์โทรศัพท์:</strong> ${user.phone}</p>
                            <p><strong>สถานะ:</strong> <span class="role-badge role-${user.role}">${getRoleText(user.role)}</span></p>
                        </div>
                    </div>
                `;
            });
        }

        function updateStaffGallery() {
            const staffGrid = document.getElementById('staffGrid');
            const itStaff = users.filter(user => user.role === 'staff' || user.role === 'admin');
            
            staffGrid.innerHTML = '';
            
            itStaff.forEach(staff => {
                const staffCard = document.createElement('div');
                staffCard.className = 'staff-card';
                
                staffCard.innerHTML = `
                    <img src="${staff.profileImage}" alt="${staff.name}" class="staff-avatar-large">
                    <div class="staff-name">${staff.name}</div>
                    <div class="staff-role">${getRoleText(staff.role)}</div>
                    <div class="staff-contact">📧 ${staff.email}</div>
                    <div class="staff-contact">📞 ${staff.phone}</div>
                `;
                
                staffGrid.appendChild(staffCard);
            });
        }

        function getRoleText(role) {
            switch(role) {
                case 'admin': return 'ผู้ดูแลระบบ';
                case 'staff': return 'เจ้าหน้าที่ IT';
                case 'user': return 'ผู้ใช้งาน';
                default: return 'ผู้ใช้งาน';
            }
        }
        function logout() {
            currentUser = null;
            switchToLogin();
            document.getElementById('emailFrom').reset();
        }

        function openRepairForm() {
            alert('เปิดหน้าแจ้งซ่อม - คุณสามารถเชื่อมต่อไปยังไฟล์ repair_from.html ได้ที่นี่');
            // window.location.href = 'repair_from.html';
        }

        function openRepairHistory() {
            alert('เปิดประวัติการซ่อม - คุณสามารถเชื่อมต่อไปยังไฟล์ History_repairs.html ได้ที่นี่');
        }

        window.addEventListener('load', function() {
            console.log('ระบบ IT Repair System พร้อมใช้งาน');
            console.log('ผู้ใช้ทดสอบ: admin@example.com / admin123');
            console.log('ผู้ใช้ทดสอบ: it@example.com / it123');
            console.log('ฟีเจอร์ใหม่: รูป Profile และแสดงรูปพนักงาน IT');
        });