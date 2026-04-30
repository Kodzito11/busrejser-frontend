import { API_BASE } from "../../../shared/api/http";

type Props = {
  imageUrl: string | null;
  onClose: () => void;
};

export default function BusImageModal({ imageUrl, onClose }: Props) {
  if (!imageUrl) return null;

  const src = imageUrl.startsWith("http")
    ? imageUrl
    : `${API_BASE}${imageUrl}`;

  return (
    <div className="imageModal" onClick={onClose}>
      <img
        src={src}
        alt="Bus billede"
        className="imageModalContent"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}