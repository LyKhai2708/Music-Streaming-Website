<template>
    <footer class="footer bg-gray text-light py-3 px-3">
      <div class="text-center">
        <div class="d-flex flex-wrap align-items-center justify-content-between">
          <a href="/" class="d-inline-flex align-items-center">
            <img src="./logo/test.png" alt="Footer Logo" class="rounded-pill me-2" style="width: 50px;">
            <span class="fw-bold text-success">Music Life</span>
          </a>

          <ul class="list-unstyled d-flex justify-content-center gap-3 mb-0">
            <li>
              <a href="https://www.facebook.com/B1ue.04/" class="text-success fs-5" aria-label="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
            </li>
            <li>
              <a href="#" class="text-success fs-5" aria-label="Twitter">
                <i class="bi bi-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/khiisme/" class="text-success fs-5" aria-label="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@khaiphuong4921" class="text-success fs-5" aria-label="YouTube">
                <i class="bi bi-youtube"></i>
              </a>
            </li>
          </ul>
  
          <p class="mb-0 small">© 2024 Music Life. All rights reserved.</p>
        </div>
      </div>
    </footer>
</template>
  

<style scoped>
.bg-gray {
  background-color: #343a40;
}


.footer {
  margin: 0;
  border: none;
  box-shadow: none;
 
}


.footer a {
  text-decoration: none;
  transition: color 0.3s ease-in-out;
}

.footer a:hover {
  color: #fff;

}

.footer p {
  font-size: 0.9rem;
  margin: 0; 
}


@media (max-width: 768px) {
  .footer .d-flex {
    flex-direction: column;
    align-items: center;
    gap: 10px; 
  }

  .footer p {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
