
type Props = {
    name: string;
    onClick?: () => void;
    image?: string[];
}


export const Button = ({name, onClick}: Props) => {
  return (
        <button onClick={onClick} className="w-max bg-[#018fd3] text-white px-5 py-2 rounded-md text-sm lg:text-base font-medium hover:bg-blue-700 transition">
            {name}
        </button>
  )
}

export const ButtonHub = ({name, onClick, image}: Props) => {
  return (
        <button onClick={onClick} className="w-max bg-white border border-[#018fd3] text-black px-5 py-2 rounded-md text-sm lg:text-base font-medium hover:bg-blue-700 transition flex items-center gap-2 hover:text-white">
            {name}
            {image && <img src={image[0]} alt="icon" className="w-5 h-5 object-contain"/>}
        </button>
  )
}