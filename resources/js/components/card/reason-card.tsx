type Props = {
    image: string;
    title: string;
    description: string;
};

const ReasonCard = ({ image, title, description }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-5 font-poppins text-white">
            <div className="reason-card w-fit p-5">
                <img src={image} alt={title} className="h-[120px] w-[120px]" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
                <h3 className="text-2xl font-extrabold">{title}</h3>
                <p className="text-center text-lg font-bold">{description}</p>
            </div>
        </div>
    );
};

export default ReasonCard;
