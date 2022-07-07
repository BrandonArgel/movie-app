import { IMG_BASE_URL } from "config";

const registerObserver = (ref: React.RefObject<HTMLImageElement>) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      const img = entry.target as HTMLImageElement;
      if (!entry.isIntersecting) {
        return;
      }
      const src = img.getAttribute("data-src") as string;
      if (typeof src === "object") {
        img.setAttribute("src", "https://movies-platzi-app.netlify.app/default_image.jpg")
      } else {
        img.setAttribute("src", `${IMG_BASE_URL}/w200/${src}`)
        img.onload = () => {
          img.classList.add("show")
          img.parentElement?.classList.remove("skeleton");
        }
      }
      observer.unobserve(img);
    });
  });
  observer.observe(ref.current as HTMLImageElement);
};

export default registerObserver;