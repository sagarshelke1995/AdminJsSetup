window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('a[data-testid="action-new"]');
    console.log(btn);

    btn.addEventListener("click", function () {
        alert("123")
      if (btn) {
      btn.innerText = "Add new Quesions";
    }
});


})


// script for accordiance 

  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const currentItem = header.parentElement;
      const currentContent = currentItem.querySelector(".accordion-content");
      const currentIcon = currentItem.querySelector(".accordion-icon");

      // Close all items
      document.querySelectorAll(".accordion-item").forEach(item => {
        if (item !== currentItem) {
          item.querySelector(".accordion-content").style.maxHeight = null;
          item.querySelector(".accordion-icon").style.transform = "rotate(0deg)";
        }
      });

      // Toggle current item
      if (currentContent.style.maxHeight) {
        currentContent.style.maxHeight = null;
        currentIcon.style.transform = "rotate(0deg)";
      } else {
        currentContent.style.maxHeight = currentContent.scrollHeight + "px";
        currentIcon.style.transform = "rotate(180deg)";
      }
    });
  });



