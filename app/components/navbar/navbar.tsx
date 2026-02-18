import NavLeft from "@/app/components/navbar/nav-left";
import NavRight from "@/app/components/navbar/nav-right";

const chatHistory = [
  { id: "123lhwe243r", title: "Getting started with wingmaite" },
  { id: "1231023ndvs", title: "Jazz database websockets" },
  { id: "23948nsdknv", title: "How does wingmaite work" },
  { id: "asdadf9mdfd", title: "Brand guidelines" },
  { id: "3204923rjfv", title: "Design system maintenance" },
  { id: "2g092hyv34v", title: "Auth0 endpoints" },
  { id: "24evf94gu35", title: "pnpm workspace for monorepos" },
  { id: "35948jf43if", title: "Guidelines for interruption design system" },
  { id: "35931423j23", title: "Typographic design principles" },
  { id: "12309123901", title: "Identifying core product loop" },
  { id: "12309sdfsdf", title: "Lifecycle for product core objects" },
  { id: "09asd78vsdf", title: "90 day work plan" },
  { id: "1409234234f", title: "Knowledge fragment request" },
  { id: "24rerbgerge", title: "Website translations" },
  { id: "12309123ffd", title: "Aria labels for accessibility" },
  { id: "adfs09ddf83", title: "UX design principles" },
  { id: "09asd832r2f", title: "Web Payments SDK" },
  { id: "ad094t3v34f", title: "Stripe Payments SDK" },
  { id: "vsd0923r23r", title: "Plans for AGI" },
  { id: "0932rjfekjv", title: "Priority vs preload in Next.js" },
  { id: "09asd23fjkv", title: "useMemo deprecation with React compiler" },
  { id: "30v24jv3444", title: "SSR vs CSR" },
  { id: "31290423fjk", title: "Sanity CMS scafold" },
  { id: "3129234f4v3", title: "Local package development" },
  { id: "2390gvu334f", title: "Marketing strategy" },
  { id: "130923f4vjk", title: "Annual report creation" },
];

function Navbar() {
  return (
    <div className="fixed top-0 z-50 flex h-12.25 w-full items-start justify-between gap-3.5 overflow-visible p-2">
      <NavLeft data={chatHistory} />
      <NavRight />
    </div>
  );
}

export default Navbar;
