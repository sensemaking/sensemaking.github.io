// Header scroll effect
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const scrollWatcher = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  // Run once on page load
  scrollWatcher();
  
  // Add scroll event listener
  window.addEventListener('scroll', scrollWatcher);
});
