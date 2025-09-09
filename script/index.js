
        // Mobile menu toggle
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');
        const body = document.body;
        
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuBtn.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuBtn.classList.remove('active');
                body.classList.remove('no-scroll');
            });
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Contact form with popup
        const contactForm = document.getElementById('contactForm');
        const popup = document.getElementById('confirmationPopup');
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Form data preparation
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                _subject: 'New portfolio contact!',
                _template: 'table'
            };
            
            // Send form data using FormSubmit
            fetch('https://formsubmit.co/ajax/debasis15parida@gmail.com', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === "true") {
                    // Show success popup
                    popup.classList.add('active');
                    contactForm.reset(); // Clear form
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully!';
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Error sending message. Please try again.';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 5000);
            });
        });

        function closePopup() {
            const popup = document.getElementById('confirmationPopup');
            popup.classList.remove('active');
        }
        
        // Close popup if clicked outside
        document.getElementById('confirmationPopup').addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });

        // CV Download Function
        function downloadCV(format) {
            // Create a temporary link element
            const link = document.createElement('a');
            
            // Set the file name and path based on the selected format
            const fileName = `Debasis_Parida_CV.${format}`;
            
            // For demonstration purposes, we'll use a placeholder URL
            // In a real scenario, you would link to your actual CV file
            link.href = `https://example.com/cv/${fileName}`;
            link.download = fileName;
            
            // Simulate click to trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show a message (in a real scenario, this would be the actual download)
            alert(`In a real implementation, this would download the ${format.toUpperCase()} version of my CV.`);
        }
  document.getElementById('downloadBtn').addEventListener('click', function() {
            // Show loading indicator
            document.getElementById('loadingIndicator').style.display = 'block';
            
            // Use setTimeout to allow the DOM to update before capturing
            setTimeout(function() {
                // Get the container element
                const element = document.querySelector('.container');
                
                // Use html2canvas to capture the content
                html2canvas(element, {
                    scale: 2, // Higher quality
                    useCORS: true,
                    logging: false
                }).then(function(canvas) {
                    // Create PDF
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    const pdf = new jspdf.jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4'
                    });
                    
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                    const imgX = (pdfWidth - imgWidth * ratio) / 2;
                    const imgY = 10;
                    
                    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                    
                    // Save the PDF
                    pdf.save('Debasis_Parida_CV.pdf');
                    
                    // Hide loading indicator
                    document.getElementById('loadingIndicator').style.display = 'none';
                    
                    // Show success message
                    document.getElementById('successMessage').style.display = 'block';
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        document.getElementById('successMessage').style.display = 'none';
                    }, 5000);
                });
            }, 100);
        });