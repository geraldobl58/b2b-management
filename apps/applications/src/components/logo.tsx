import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link passHref href="/">
      <Image
        src="/assets/images/logo.svg"
        alt="Auto Connect"
        width={30}
        height={30}
      />
    </Link>
  );
};
