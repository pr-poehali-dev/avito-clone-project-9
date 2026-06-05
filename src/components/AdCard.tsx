import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface Ad {
  id: number;
  title: string;
  price: number;
  city: string;
  category: string;
  image: string;
  premium: boolean;
  date: string;
  views: number;
}

interface AdCardProps {
  ad: Ad;
  onFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

export default function AdCard({ ad, onFavorite, isFavorite }: AdCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden border card-hover cursor-pointer ${ad.premium ? "border-brand-orange/30 shadow-md shadow-orange-50" : "border-border"}`}>
      {ad.premium && (
        <div className="absolute top-3 left-3 z-10 badge-premium">⭐ Премиум</div>
      )}
      <button
        onClick={(e) => { e.preventDefault(); onFavorite?.(ad.id); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all hover:scale-110"
      >
        <Icon
          name="Heart"
          size={16}
          className={isFavorite ? "text-brand-pink fill-brand-pink" : "text-muted-foreground"}
        />
      </button>

      <Link to={`/ad/${ad.id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />
        </div>
        <div className="p-3">
          <div className="font-heading font-bold text-lg text-brand-orange mb-1">
            {formatPrice(ad.price)}
          </div>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 leading-snug">
            {ad.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={11} />
              <span>{ad.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Icon name="Eye" size={11} />
                <span>{ad.views}</span>
              </div>
              <span>{ad.date}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
