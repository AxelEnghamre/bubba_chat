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
    <Link className="flex items-center space-x-2" href={`chat/${chatId}`}>
      {name}
    </Link>
  );
};

export default LinkChat;
