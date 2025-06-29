import { formatDate } from "@/lib/ServerUtils";
import Carousel from "./Carousel";

export default function PromoSection ({data}) {
    return (
      <Carousel>
        {
          data.map((item, index) =>(
            <div
              className="snap-center shrink-0 w-80 sm:w-96 flex flex-col items-center"
              key={"promo_" + item.id}
            >
              <span className="self-center text-lg w-full select-none">
                <figure>
                  <img
                    className="rounded-2xl max-h-96 w-full object-cover pointer-events-none"
                    src={item.mediaUrl}
                    loading='lazy'
                    alt="Promo"
                  />
                </figure>
                <div className="card-body p-4">
                  <h5 className="card-title text-lg md:text-xl">{item.name}</h5>
                  <div className="mb-2 flex items-center text-md gap-2">
                    <span className="icon-[tabler--calendar-event] size-5 md:size-7"></span>
                    <p className="text-base md:text-lg">{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                  </div>
                  <div className="card-actions">
                    <a href={`/promo/` + item.slug} className="btn btn-sm md:btn-md btn-primary">Detail</a>
                  </div>
                </div>
              </span>
            </div>
          ))
        }
      </Carousel>
    )
}