import { toRupiah } from "@/lib/ServerUtils";
import Carousel from "./Carousel";

export default function CarSection ({data}) {
  return (
    <Carousel>
      {
        data.map((item, index) =>(
          <div
            className="snap-center shrink-0 w-80 sm:w-96 flex flex-col items-center"
            key={"car_" + item.id}
          >
            <span className="self-center text-lg w-full select-none">
              <figure><img loading='lazy' className='rounded-2xl pointer-events-none' src={item.mediaFiles?.[0]?.url} alt="Carousel" /></figure>
              <div className="card-body p-4">
                <h5 className="card-title text-lg md:text-xl">{item.name}</h5>
                <div className='flex gap-2'>
                  {
                    item.tags?.map((tag) => (
                      <span key={"tag_" + tag.id} className="badge badge-outline badge-primary">{tag.name}</span>
                    ))
                  }
                </div>
                <p className="mb-2 text-base md:text-lg">Harga mulai {toRupiah(item.minPrice)}</p>
                <div className="card-actions">
                    <a href={`/mobil/` + item.slug} className="btn btn-sm md:btn-md btn-primary">Detail</a>
                  </div>
              </div>
            </span>
          </div>
        ))
      }
    </Carousel>
  )
}