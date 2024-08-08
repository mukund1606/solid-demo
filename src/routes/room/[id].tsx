import { useParams } from "@solidjs/router";

export default function Room() {
  const params = useParams();
  console.log(params.id);
  return <div>Room</div>;
}
