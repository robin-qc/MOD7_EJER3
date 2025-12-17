// script.js - Funcionalidades completas para la galería profesional

document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // 1. TEMA CLARO/OSCURO
    // =======================================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('.theme-text');

    // Verificar tema guardado o preferencia del sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');

    // Aplicar tema inicial
    function applyInitialTheme() {
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeText.textContent = 'Modo Claro';
        }
    }
    
    applyInitialTheme();

    // Cambiar tema al hacer clic
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeText.textContent = 'Modo Claro';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeText.textContent = 'Modo Oscuro';
            localStorage.setItem('theme', 'light');
        }
    });

    // =======================================================
    // 2. FILTROS VINCULADOS CON IMÁGENES
    // =======================================================
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase active de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Añadir clase active al botón clickeado
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Contador para animaciones escalonadas
                let delay = 0;
                
                // Mostrar u ocultar tarjetas según el filtro
                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        // Si está oculta, mostrarla con animación
                        if (card.style.display === 'none' || card.style.display === '') {
                            card.style.display = 'flex';
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                card.style.transition = `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`;
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 10);
                            
                            delay += 50; // Incrementar retardo para siguiente tarjeta
                        }
                    } else {
                        // Ocultar con animación
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Reorganizar el grid después del filtrado
                setTimeout(() => {
                    const galleryGrid = document.querySelector('.gallery-grid');
                    // Forzar reflow para recalcular posiciones
                    galleryGrid.style.display = 'none';
                    void galleryGrid.offsetWidth; // Trigger reflow
                    galleryGrid.style.display = 'grid';
                }, 500);
            });
        });
    }
    
    // Llamar a la función al cargar la página
    initializeFilters();

    // =======================================================
    // 3. LIGHTBOX PARA IMÁGENES AMPLIADAS
    // =======================================================
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    // Abrir lightbox
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-btn')) {
            const button = e.target.closest('.view-btn');
            const imageUrl = button.getAttribute('data-image');
            const card = button.closest('.card');
            const imageAlt = card.querySelector('img').getAttribute('alt');
            const cardTitle = card.querySelector('.card-title').textContent;
            
            lightboxImage.src = imageUrl;
            lightboxImage.alt = imageAlt;
            lightboxCaption.textContent = `${cardTitle} - ${imageAlt}`;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        }
    });
    
    // Cerrar lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Limpiar imagen después de cerrar
        setTimeout(() => {
            lightboxImage.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    }

    // =======================================================
    // 4. FUNCIONALIDAD DE "ME GUSTA"
    // =======================================================
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            const button = e.target.closest('.like-btn');
            const likeCount = button.querySelector('.like-count');
            const heartIcon = button.querySelector('i');
            let currentCount = parseInt(likeCount.textContent);
            
            if (button.classList.contains('liked')) {
                // Quitar "me gusta"
                button.classList.remove('liked');
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                likeCount.textContent = currentCount - 1;
                
                // Efecto visual de quitar like
                button.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            } else {
                // Añadir "me gusta"
                button.classList.add('liked');
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                likeCount.textContent = currentCount + 1;
                
                // Efecto visual de like
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
                
                // Animación de corazón
                heartIcon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    heartIcon.style.transform = 'scale(1)';
                }, 300);
            }
        }
    });

    // =======================================================
    // 5. EFECTO DE CARGA PROGRESIVA DE TARJETAS
    // =======================================================
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Observador para animación de aparición
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Aplicar animación inicial a las tarjetas
    function initializeCardAnimations() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            observer.observe(card);
            
            // Forzar aparición después de un tiempo por si el observador falla
            setTimeout(() => {
                if (parseFloat(card.style.opacity) === 0) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            }, 1000 + (index * 100));
        });
    }
    
    initializeCardAnimations();

    // =======================================================
    // 6. CARGA DINÁMICA DE MÁS CONTENIDO
    // =======================================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let isLoading = false;
    let cardCounter = 113; // Empezar desde un ID más alto
    
    loadMoreBtn.addEventListener('click', loadMoreCards);
    
    function loadMoreCards() {
        if (isLoading) return;
        
        isLoading = true;
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Cargando...';
        
        // Simular carga de API (1.5 segundos)
        setTimeout(() => {
            // Generar y añadir nuevas tarjetas
            const newCardCount = 4;
            const categories = ['nature', 'urban', 'animals', 'architecture'];
            const categoryNames = {
                'nature': 'Naturaleza',
                'urban': 'Urbano', 
                'animals': 'Animales',
                'architecture': 'Arquitectura'
            };
            
            const titles = {
                'nature': ['Bosque Encantado', 'Lago Sereno', 'Montañas Doradas', 'Atardecer en el Campo'],
                'urban': ['Metrópolis', 'Calle Principal', 'Skyline Nocturno', 'Arquitectura Moderna'],
                'animals': ['Fauna Salvaje', 'Aves Exóticas', 'Vida Marina', 'Mundo Animal'],
                'architecture': ['Diseño Vanguardista', 'Estructuras Únicas', 'Arquitectura Sostenible', 'Edificios Icónicos']
            };
            
            const descriptions = {
                'nature': 'Un paisaje natural que inspira paz y conexión con la naturaleza.',
                'urban': 'La vibrante vida urbana capturada en su máximo esplendor.',
                'animals': 'La belleza y diversidad del reino animal en su hábitat natural.',
                'architecture': 'Diseños innovadores que desafían los límites de la creatividad.'
            };
            
            for (let i = 0; i < newCardCount; i++) {
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const isTall = Math.random() > 0.7;
                const isWide = Math.random() > 0.7;
                const isBig = isTall && isWide;
                
                let cardClass = 'card';
                if (isBig) cardClass += ' card-big';
                else if (isTall) cardClass += ' card-tall';
                else if (isWide) cardClass += ' card-wide';
                
                // Determinar dimensiones de imagen
                let imgWidth = 400, imgHeight = 400;
                if (isTall) imgHeight = 600;
                if (isWide) imgWidth = 600;
                if (isBig) { imgWidth = 800; imgHeight = 800; }
                
                // Seleccionar título aleatorio para la categoría
                const categoryTitles = titles[randomCategory];
                const randomTitleIndex = Math.floor(Math.random() * categoryTitles.length);
                const cardTitle = categoryTitles[randomTitleIndex];
                
                // Crear nueva tarjeta
                const newCard = document.createElement('article');
                newCard.className = cardClass;
                newCard.setAttribute('data-category', randomCategory);
                newCard.style.opacity = '0';
                newCard.style.transform = 'translateY(30px)';
                
                // Incrementar contador para ID único
                cardCounter++;
                
                newCard.innerHTML = `
                    <figure class="card-figure">
                        <img src="https://picsum.photos/id/${cardCounter}/${imgWidth}/${imgHeight}" alt="${cardTitle}">
                        <div class="card-overlay">
                            <button class="view-btn" data-image="https://picsum.photos/id/${cardCounter}/${imgWidth*2}/${imgHeight*2}">
                                <i class="fas fa-expand"></i> Ampliar
                            </button>
                        </div>
                        ${Math.random() > 0.7 ? `<span class="featured-badge"><i class="fas fa-star"></i> Nuevo</span>` : ''}
                    </figure>
                    <div class="card-content">
                        <div class="card-meta">
                            <span class="card-category">${categoryNames[randomCategory]}</span>
                            <span class="card-date"><i class="far fa-calendar"></i> ${getRandomDate()}</span>
                        </div>
                        <h3 class="card-title">${cardTitle}</h3>
                        <p class="card-description">${descriptions[randomCategory]}</p>
                        <div class="card-footer">
                            <button class="like-btn">
                                <i class="far fa-heart"></i> <span class="like-count">${Math.floor(Math.random() * 50)}</span>
                            </button>
                            <a href="#" class="share-btn">
                                <i class="fas fa-share-alt"></i> Compartir
                            </a>
                        </div>
                    </div>
                `;
                
                // Añadir al grid
                galleryGrid.appendChild(newCard);
                
                // Observar nueva tarjeta para animación
                observer.observe(newCard);
                
                // Animación de entrada
                setTimeout(() => {
                    newCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    newCard.style.opacity = '1';
                    newCard.style.transform = 'translateY(0)';
                }, 100 + (i * 100));
            }
            
            // Restaurar estado del botón
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Cargar Más Imágenes';
            isLoading = false;
            
            // Re-inicializar filtros para incluir nuevas tarjetas
            initializeFilters();
            
        }, 1500);
    }
    
    // Función auxiliar para generar fechas aleatorias
    function getRandomDate() {
        const start = new Date(2025, 0, 1);
        const end = new Date(2025, 11, 18);
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return randomDate.toLocaleDateString('es-ES', options);
    }

    // =======================================================
    // 7. MEJORA DE FILTROS - VINCULACIÓN CON SCROLL
    // =======================================================
    // Resaltar filtro activo basado en scroll
    window.addEventListener('scroll', function() {
        const cards = document.querySelectorAll('.card:not([style*="display: none"])');
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        // Encontrar la tarjeta más visible
        let mostVisibleCard = null;
        let maxVisibility = 0;
        
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardTop = rect.top + scrollPosition;
            const cardBottom = rect.bottom + scrollPosition;
            
            // Calcular cuánto de la tarjeta es visible
            const visibleTop = Math.max(scrollPosition, cardTop);
            const visibleBottom = Math.min(scrollPosition + viewportHeight, cardBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibilityRatio = visibleHeight / rect.height;
            
            if (visibilityRatio > maxVisibility) {
                maxVisibility = visibilityRatio;
                mostVisibleCard = card;
            }
        });
        
        // Si hay una tarjeta suficientemente visible, resaltar su filtro
        if (mostVisibleCard && maxVisibility > 0.3) {
            const cardCategory = mostVisibleCard.getAttribute('data-category');
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(button => {
                const filterValue = button.getAttribute('data-filter');
                if (filterValue === cardCategory || (filterValue === 'all' && !button.classList.contains('active'))) {
                    button.classList.add('highlight');
                } else {
                    button.classList.remove('highlight');
                }
            });
        }
    });

    // =======================================================
    // 8. MEJORA DE USABILIDAD - SHORTCUTS DE TECLADO
    // =======================================================
    document.addEventListener('keydown', function(e) {
        // Tecla 'T' para cambiar tema
        if (e.key === 't' || e.key === 'T') {
            if (e.ctrlKey || e.metaKey) {
                themeToggle.click();
                e.preventDefault();
            }
        }
        
        // Teclas 1-5 para filtrar
        if (e.key >= '1' && e.key <= '5') {
            const filterIndex = parseInt(e.key) - 1;
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            if (filterButtons[filterIndex]) {
                filterButtons[filterIndex].click();
                e.preventDefault();
            }
        }
        
        // Tecla 'L' para lightbox (si hay una imagen visible)
        if (e.key === 'l' || e.key === 'L') {
            const firstVisibleCard = document.querySelector('.card:not([style*="display: none"])');
            if (firstVisibleCard) {
                const viewBtn = firstVisibleCard.querySelector('.view-btn');
                if (viewBtn) {
                    viewBtn.click();
                    e.preventDefault();
                }
            }
        }
    });

    // =======================================================
    // 9. MEJORA DE PERFORMANCE - LAZY LOADING DE IMÁGENES
    // =======================================================
    function initializeLazyLoading() {
        const images = document.querySelectorAll('.card-figure img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    
                    // Cargar imagen si no está cargada
                    if (!img.loaded) {
                        img.src = src;
                        img.loaded = true;
                        
                        // Efecto de fade in
                        img.style.opacity = '0';
                        setTimeout(() => {
                            img.style.transition = 'opacity 0.5s ease';
                            img.style.opacity = '1';
                        }, 100);
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            // Guardar src original en data-src
            if (!img.hasAttribute('data-src')) {
                img.setAttribute('data-src', img.src);
                // Usar placeholder mientras carga
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSI5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXJnYW5kby4uLjwvdGV4dD48L3N2Zz4=';
                img.loaded = false;
            }
            imageObserver.observe(img);
        });
    }
    
    // Inicializar lazy loading después de un pequeño retardo
    setTimeout(initializeLazyLoading, 1000);
});