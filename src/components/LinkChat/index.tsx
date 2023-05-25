import Link from "next/link";

const LinkChat = ({
  chatId,
  name,
  imgUrl,
}: {
  chatId: string;
  name: string;
  imgUrl: string;
}) => {
  return (
    <Link href={`chat/${chatId}`} className="text-white">
      {name}
    </Link>
  );
};

export default LinkChat;