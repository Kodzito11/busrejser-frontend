type Props = {
  imageUrl: string | null;
  onClose: () => void;
};

export default function BusImageModal({ imageUrl, onClose }: Props) {
  if (!imageUrl) return null;

  return (
    <div className="imageModal" onClick={onClose}>
      <img
        src={imageUrl}
        alt="Bus billede"
        className="imageModalContent"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}