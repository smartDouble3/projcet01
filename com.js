
        let repairTickets = JSON.parse(localStorage.getItem('repairTickets') || '[]');
        let ticketCounter = JSON.parse(localStorage.getItem('ticketCounter') || '1');
        let filteredData = [...repairTickets];
        let currentFilter = 'all';
        let uploadedFiles = [];

        document.addEventListener('DOMContentLoaded', function() {
            updateStats();
            renderTable();
            setupEventListeners();
        });

        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(tabName + '-tab').classList.add('active');
            
            event.target.classList.add('active');
            
            if (tabName === 'history') {
                updateStats();
                renderTable();
            }
        }

        function handleFileSelect(event) {
            const files = Array.from(event.target.files);
            processFiles(files);
        }

        function handleDrop(event) {
            event.preventDefault();
            event.stopPropagation();
            event.target.classList.remove('dragover');
            
            const files = Array.from(event.dataTransfer.files);
            processFiles(files);
        }

        function handleDragOver(event) {
            event.preventDefault();
            event.stopPropagation();
            event.target.classList.add('dragover');
        }

        function handleDragLeave(event) {
            event.preventDefault();
            event.stopPropagation();
            event.target.classList.remove('dragover');
        }

        function processFiles(files) {
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    if (file.size <= 5 * 1024 * 1024) {
                        uploadedFiles.push(file);
                        displayUploadedFile(file);
                    } else {
                        showMessage('ไฟล์ ' + file.name + ' มีขนาดใหญ่เกิน 5MB', 'error');
                    }
                } else {
                    showMessage('ไฟล์ ' + file.name + ' ไม่ใช่รูปภาพ', 'error');
                }
            });
        }

        function displayUploadedFile(file) {
            const container = document.getElementById('uploadedFiles');
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.fileName = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                fileItem.innerHTML = `
                    <div class="file-info">
                        <img src="${e.target.result}" alt="${file.name}" class="image-preview">
                        <div class="file-details">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                    <i class="fas fa-times remove-file" onclick="removeFile('${file.name}')"></i>
                `;
            };
            reader.readAsDataURL(file);
            
            container.appendChild(fileItem);
        }

        function removeFile(fileName) {
            uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
            document.querySelector(`[data-file-name="${fileName}"]`).remove();
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showMessage(message, type = 'success') {
            const messageContainer = document.getElementById('messageContainer');
            const messageClass = type === 'success' ? 'success-message' : 'error-message';
            messageContainer.innerHTML = `<div class="${messageClass}">${message}</div>`;
            
            messageContainer.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 5000);
        }

        function generateTicketNumber() {
            const now = new Date();
            const year = now.getFullYear().toString().substr(-2);
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const counter = String(ticketCounter).padStart(3, '0');
            
            return `IT${year}${month}${day}${counter}`;
        }

        function getEquipmentTypeThai(type) {
            const types = {
                'desktop': 'คอมพิวเตอร์ตั้งโต๊ะ',
                'laptop': 'แล็ปท็อป',
                'printer': 'เครื่องพิมพ์',
                'scanner': 'เครื่องสแกน',
                'network': 'อุปกรณ์เครือข่าย',
                'monitor': 'จอภาพ',
                'ups': 'เครื่องสำรองไฟ (UPS)',
                'software': 'ซอฟต์แวร์',
                'other': 'อื่นๆ'
            };
            return types[type] || type;
        }

        function getUrgencyText(urgency) {
            const urgencies = {
                'R0': 'รอได้',
                'R1': 'ปกติ',
                'R2': 'เร่งด่วน',
                'R3': 'ด่วนที่สุด'
            };
            return urgencies[urgency] || urgency;
        }
        function getStatusText(status) {
            const statuses = {
                'pending': 'รอดำเนินการ',
                'in-progress': 'กำลังซ่อม',
                'completed': 'เสร็จสิ้น'
            };
            return statuses[status] || status;
        }

        function validateForm(formData) {
            const errors = [];
            
            if (!formData.contactName.trim()) {
                errors.push('กรุณากรอกชื่อผู้ติดต่อ');
            }
            
            if (!formData.phoneNumber.trim()) {
                errors.push('กรุณากรอกเบอร์โทรศัพท์');
            } else if (!/^[0-9-+\s()]+$/.test(formData.phoneNumber)) {
                errors.push('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
            }
            
            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.push('รูปแบบอีเมลไม่ถูกต้อง');
            }
            
            if (!formData.department.trim()) {
                errors.push('กรุณากรอกแผนก/หน่วยงาน');
            }
            
            if (!formData.location.trim()) {
                errors.push('กรุณากรอกสถานที่');
            }
            
            if (!formData.urgency) {
                errors.push('กรุณาเลือกระดับความเร่งด่วน');
            }
            
            if (!formData.equipmentType) {
                errors.push('กรุณาเลือกประเภทอุปกรณ์');
            }
            
            if (!formData.problemDescription.trim()) {
                errors.push('กรุณาอธิบายรายละเอียดปัญหา');
            }
            
            return errors;
        }

        document.getElementById('repairForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                contactName: document.getElementById('contactName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                email: document.getElementById('email').value,
                department: document.getElementById('department').value,
                location: document.getElementById('location').value,
                urgency: document.getElementById('urgency').value,
                equipmentType: document.getElementById('equipmentType').value,
                problemDescription: document.getElementById('problemDescription').value,
                additionalInfo: document.getElementById('additionalInfo').value,
                ticketNumber: generateTicketNumber(),
                dateCreated: new Date().toISOString(),
                status: 'pending',
                technician: '-',
                expectedDate: getExpectedDate(document.getElementById('urgency').value),
                images: uploadedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    data: null
                }))
            };
            
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                showMessage('กรุณาแก้ไขข้อมูลต่อไปนี้:<br>• ' + errors.join('<br>• '), 'error');
                return;
            }
            
            repairTickets.push(formData);
            ticketCounter++;
            
            localStorage.setItem('repairTickets', JSON.stringify(repairTickets));
            localStorage.setItem('ticketCounter', JSON.stringify(ticketCounter));
            
            showMessage(`✅ ส่งคำขอซ่อมสำเร็จ!<br>หมายเลข Ticket: <strong>${formData.ticketNumber}</strong><br>ทีม IT จะติดต่อกลับภายใน 24 ชั่วโมง<br>คาดว่าจะแก้ไขเสร็จ: <strong>${formatThaiDate(formData.expectedDate)}</strong>`, 'success');
            
            resetForm();
            
            updateStats();
            renderTable();
        });
        function getExpectedDate(urgency) {
            const now = new Date();
            let days = 7;
            
            switch(urgency) {
                case 'R1': days = 3; break;
                case 'R2': days = 1; break;
                case 'R3': days = 0.17; break;
            }
            
            now.setDate(now.getDate() + days);
            return now.toISOString();
        }

        // Format Thai date
        function formatThaiDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function resetForm() {
            document.getElementById('repairForm').reset();
            uploadedFiles = [];
            document.getElementById('uploadedFiles').innerHTML = '';
            document.getElementById('messageContainer').innerHTML = '';
        }

        function updateStats() {
            const pending = repairTickets.filter(item => item.status === 'pending').length;
            const inProgress = repairTickets.filter(item => item.status === 'in-progress').length;
            const completed = repairTickets.filter(item => item.status === 'completed').length;
            const total = repairTickets.length;

            document.getElementById('pendingCount').textContent = pending;
            document.getElementById('progressCount').textContent = inProgress;
            document.getElementById('completedCount').textContent = completed;
            document.getElementById('totalCount').textContent = total;
        }

 
        function setupEventListeners() {
            document.getElementById('searchInput').addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                filterData(searchTerm, currentFilter);
            });

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                    filterData(searchTerm, currentFilter);
                });
            });
        }

        function filterData(searchTerm = '', filter = 'all') {
            filteredData = repairTickets.filter(item => {
                const matchesSearch = !searchTerm || 
                    getEquipmentTypeThai(item.equipmentType).toLowerCase().includes(searchTerm) ||
                    item.problemDescription.toLowerCase().includes(searchTerm) ||
                    item.contactName.toLowerCase().includes(searchTerm) ||
                    item.ticketNumber.toLowerCase().includes(searchTerm);

                const matchesFilter = filter === 'all' || item.status === filter;

                return matchesSearch && matchesFilter;
            });

            renderTable();
        }

        function renderTable() {
            const tableBody = document.getElementById('repairTableBody');
            
            if (filteredData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="10" style="text-align: center; padding: 40px; color: #666;">
                            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                            <br>ไม่พบข้อมูลที่ตรงกับการค้นหา
                        </td>
                    </tr>
                `;
                return;
            }

            tableBody.innerHTML = filteredData.map((item, index) => `
                <tr data-id="${item.ticketNumber}">
                    <td><strong>#${(index + 1).toString().padStart(3, '0')}</strong></td>
                    <td>${formatThaiDate(item.dateCreated)}</td>
                    <td>${item.contactName}</td>
                    <td><strong>${getEquipmentTypeThai(item.equipmentType)}</strong></td>
                    <td style="text-align: left; max-width: 200px;">${item.problemDescription.substring(0, 50)}${item.problemDescription.length > 50 ? '...' : ''}</td>
                    <td>
                        <span class="priority-${item.urgency.toLowerCase()}">
                            ${getUrgencyText(item.urgency)}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge status-${item.status}">
                            ${getStatusText(item.status)}
                        </span>
                    </td>
                    <td>${item.technician}</td>
                    <td>${formatThaiDate(item.expectedDate)}</td>
                    <td>
                        <div class="actions">
                            <button class="action-btn btn-view" onclick="viewDetails('${item.ticketNumber}')" title="ดูรายละเอียด">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" onclick="editItem('${item.ticketNumber}')" title="แก้ไข">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteItem('${item.ticketNumber}')" title="ลบ">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function viewDetails(ticketNumber) {
            const item = repairTickets.find(item => item.ticketNumber === ticketNumber);
            if (item) {
                let imageInfo = '';
                if (item.images && item.images.length > 0) {
                    imageInfo = `\nรูปภาพประกอบ: ${item.images.length} ไฟล์`;
                }
                
                alert(`รายละเอียดการซ่อม ${ticketNumber}
                
วันที่แจ้ง: ${formatThaiDate(item.dateCreated)}
ผู้แจ้ง: ${item.contactName}
โทรศัพท์: ${item.phoneNumber}
อีเมล: ${item.email || 'ไม่ระบุ'}
แผนก: ${item.department}
สถานที่: ${item.location}
อุปกรณ์: ${getEquipmentTypeThai(item.equipmentType)}
ปัญหา: ${item.problemDescription}
ข้อมูลเพิ่มเติม: ${item.additionalInfo || 'ไม่มี'}
ระดับความสำคัญ: ${getUrgencyText(item.urgency)}
สถานะ: ${getStatusText(item.status)}
ผู้รับผิดชอบ: ${item.technician}
วันที่คาดว่าจะเสร็จ: ${formatThaiDate(item.expectedDate)}${imageInfo}`);
            }
        }
        function editItem(ticketNumber) {
            alert(`แก้ไขรายการซ่อม ${ticketNumber}\n\nฟีเจอร์นี้อยู่ระหว่างการพัฒนา`);
        }

        function deleteItem(ticketNumber) {
            if (confirm(`ต้องการลบรายการซ่อม ${ticketNumber} หรือไม่?`)) {
                const index = repairTickets.findIndex(item => item.ticketNumber === ticketNumber);
                if (index !== -1) {
                    repairTickets.splice(index, 1);
                    localStorage.setItem('repairTickets', JSON.stringify(repairTickets));
                    filterData(document.getElementById('searchInput').value.toLowerCase(), currentFilter);
                    updateStats();
                    showMessage('ลบรายการเรียบร้อยแล้ว', 'success');
                }
            }
        }

        function loadDemoData() {
            if (repairTickets.length === 0) {
                const demoTickets = [
                    {
                        contactName: 'นายสมชาย ใจดี',
                        phoneNumber: '081-234-5678',
                        email: 'somchai@company.com',
                        department: 'แผนกบัญชี',
                        location: 'อาคาร A ชั้น 2 ห้อง 201',
                        urgency: 'R2',
                        equipmentType: 'desktop',
                        problemDescription: 'คอมพิวเตอร์เปิดไม่ติด หลังจากฟ้าฟ้าผ่าเมื่อคืน ไฟ LED ไม่สว่าง',
                        additionalInfo: 'เกิดขึ้นหลังฟ้าฟ้าผ่าเมื่อคืนนี้',
                        ticketNumber: 'IT250825001',
                        dateCreated: new Date('2025-08-25T08:30:00').toISOString(),
                        status: 'in-progress',
                        technician: 'นายเทพ ช่างซ่อม',
                        expectedDate: new Date('2025-08-26T17:00:00').toISOString(),
                        images: []
                    },
                    {
                        contactName: 'นางสาวมาลี สวยงาม',
                        phoneNumber: '082-345-6789',
                        email: 'malee@company.com',
                        department: 'แผนกการตลาด',
                        location: 'อาคาร B ชั้น 3 ห้อง 305',
                        urgency: 'R1',
                        equipmentType: 'printer',
                        problemDescription: 'เครื่องพิมพ์พิมพ์ไม่ออก กระดาษติด และพิมพ์ไม่ชัด',
                        additionalInfo: 'ใช้งานมา 3 ปี ไม่เคยเปลี่ยนหัวพิมพ์',
                        ticketNumber: 'IT250825002',
                        dateCreated: new Date('2025-08-24T14:15:00').toISOString(),
                        status: 'completed',
                        technician: 'นายสมศักดิ์ ฟิกเซอร์',
                        expectedDate: new Date('2025-08-27T17:00:00').toISOString(),
                        images: []
                    },
                    {
                        contactName: 'นายประชา ทำงาน',
                        phoneNumber: '083-456-7890',
                        email: '',
                        department: 'แผนกผลิต',
                        location: 'อาคาร C ชั้น 1 ห้อง 101',
                        urgency: 'R3',
                        equipmentType: 'monitor',
                        problemDescription: 'หน้าจอกระพริบ และมีเส้นแนวตั้ง',
                        additionalInfo: '',
                        ticketNumber: 'IT250825003',
                        dateCreated: new Date('2025-08-25T10:20:00').toISOString(),
                        status: 'pending',
                        technician: '-',
                        expectedDate: new Date('2025-08-25T14:20:00').toISOString(),
                        images: []
                    }
                ];
                
                repairTickets = demoTickets;
                ticketCounter = 4;
                localStorage.setItem('repairTickets', JSON.stringify(repairTickets));
                localStorage.setItem('ticketCounter', JSON.stringify(ticketCounter));
                
                updateStats();
                renderTable();
            }
        }


        loadDemoData();

        setupEventListeners();