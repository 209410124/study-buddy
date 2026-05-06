import Image from "next/image";

type StudyBuddyAvatarProps = {
  size?: number;
  className?: string;
};

export function StudyBuddyAvatar({ size = 40, className = "" }: StudyBuddyAvatarProps) {
  return (
    <Image
      src="/images/study-buddy-avatar.png"
      alt="Hank avatar"
      width={size}
      height={size}
      className={`rounded-full border border-sky-100 bg-white object-cover shadow-sm ${className}`}
      priority={size >= 40}
    />
  );
}
