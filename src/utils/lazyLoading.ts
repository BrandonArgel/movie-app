import { IMG_BASE_URL, DEFAULT_BANNER, DEFAULT_IMAGE } from "config";

const registerObserver = (ref: React.RefObject<HTMLImageElement>, currentSrc?: boolean, banner?: boolean) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target as HTMLImageElement;
      if (currentSrc) {
        const src = img.src
        img.setAttribute("src", "")
        img.src = src
      } else {
        const src = img.getAttribute("data-src") as string;
        img.setAttribute("src", `${IMG_BASE_URL}/w200/${src}`)
      }

      img.onload = () => {
        img.classList.add("show")
        img.parentElement?.classList.remove("skeleton");
      }

      img.onerror = () => {
        if (banner) {
          img.setAttribute("src", DEFAULT_BANNER)
        } else {
          img.setAttribute("src", DEFAULT_IMAGE)
        }
      }

      observer.unobserve(img);
    });
  });
  observer.observe(ref.current as HTMLImageElement);
};

export default registerObserver;