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
    <Link href={`chat/${chatId}`}>
      <a className="text-white">{name}</a>
    </Link>
  );
};
