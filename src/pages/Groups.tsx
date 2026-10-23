import RoomGuide from "@/components/RoomGuide";
import Seo from "@/components/seo/Seo";

export default function Groups() {
  return (
    <>
      <Seo
        title="Communities"
        description="A directory of Seattle's entrepreneurial community groups: who runs each room, who it's built for, what you leave with, and how to get in."
        path="/groups"
      />
      <RoomGuide />
    </>
  );
}
