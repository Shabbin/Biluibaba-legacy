import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="border-r-2">
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">My Account</h2>
        <div className="flex flex-col gap-2 pt-4 px-4 text-lg text-gray-500">
          <Link href="/my-account/profile">My Profile</Link>
          <Link href="/my-account/address">My Address</Link>
        </div>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <div className="flex flex-col gap-2 pt-4 px-4 text-lg text-gray-500">
          <Link href="/my-account/orders">My Orders</Link>
          <Link href="/my-account/orders-cancellation">My Cancellation</Link>
          <Link href="/my-account/order-returns">My Returns</Link>
        </div>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">My Bookings</h2>
        <div className="flex flex-col gap-2 pt-4 px-4 text-lg text-gray-500">
          <Link href="/my-account/vet?type=online">Vet Online</Link>
          <Link href="/my-account/vet?type=offline">Vet Offline</Link>
          <Link href="/my-account/vet?type=home-service">Home Service</Link>
          <Link href="/my-account/vet?type=emergency">Emergency</Link>
          <Link href="/my-account/vet?type=vaccine">Vaccine</Link>
          <Link href="/my-account/vet?type=neutered/sprayed">
            Neutered/Sprayed
          </Link>
        </div>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">My Adoptions</h2>
        <div className="flex flex-col gap-2 pt-4 px-4 text-lg text-gray-500">
          <Link href="/adoptions/post">Adoption Post</Link>
          <Link href="/my-account/adoptions">My Adoption</Link>
          <Link href="/my-account/adoptions/wishlist">Adoption Wishlist</Link>
        </div>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">My Donation</h2>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">Subscription</h2>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>
      <div className="border-b-2 p-5">
        <h2 className="text-xl font-semibold">Wishlist</h2>
      </div>
      <div className="border-b-2 p-5">
        <Link className="text-xl font-semibold" href="/logout">
          Logout
        </Link>
      </div>
    </div>
  );
}
