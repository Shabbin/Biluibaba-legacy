export interface AdoptionComment {
  id: number;
  name: string;
  comment: string;
  profilePic: string;
  uploaded: string;
}

export interface PostedBy {
  name: string;
  profilePic: string;
  memberSince: string;
}

export interface DemoAdoption {
  id: number;
  pet: string;
  name: string;
  location: string;
  addedOn: string;
  pic: string;
  breed: string;
  gender: string;
  age: string;
  size: string;
  postedBy: PostedBy;
  vaccinated: string;
  neutered: string;
  description: string;
  comments: AdoptionComment[];
}

const AdoptionData: DemoAdoption[] = [
  {
    id: 0,
    pet: "Cat",
    name: "Han",
    location: "Dhaka, Dhaka District, Dhaka Division, Bangladesh",
    addedOn: "August 19, 2022",
    pic: "/adoption/adopt1.jpg",
    breed: "Unidentified",
    gender: "Female",
    age: "6-12 months",
    size: "Regular",
    postedBy: {
      name: "Aminul Islam",
      profilePic: "A",
      memberSince: "April, 2024",
    },
    vaccinated: "Yes",
    neutered: "No",
    description:
      "Amet elit et quis labore dolor eiusmod cupidatat aliquip esse tempor irure non reprehenderit. Sint dolor exercitation fugiat sint ex culpa anim. Eiusmod ex duis consectetur dolor dolor fugiat eu amet. Consequat deserunt fugiat sunt quis eiusmod veniam aliquip. Duis veniam officia nostrud commodo fugiat id aliqua ut dolor. In aliquip nulla esse duis consectetur eiusmod in officia id est nisi commodo. Excepteur elit aute est fugiat deserunt id magna ut incididunt sint laboris cillum veniam minim.",
    comments: [
      {
        id: 0,
        name: "Nahian Khan",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "Just now",
      },
      {
        id: 1,
        name: "Nusrat Fariha",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "September 1, 2024 at 5:39 PM",
      },
      {
        id: 2,
        name: "John Doe",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "J",
        uploaded: "August 2, 2024 at 3:15 PM",
      },
    ],
  },
  {
    id: 1,
    name: "Cutti",
    pet: "Cat",
    location: "Dhaka, Dhaka District, Dhaka Division, Bangladesh",
    addedOn: "April 2, 2023",
    pic: "/adoption/adopt2.jpeg",
    breed: "Mixed",
    gender: "Female",
    age: "0-6 months",
    size: "Small",
    postedBy: {
      name: "Aminul Islam",
      profilePic: "A",
      memberSince: "April, 2024",
    },
    vaccinated: "Yes",
    neutered: "No",
    description:
      "Litter trained. Very friendly nature. Can adopt anyone as her friend. She loves to play most of the time. She only eat boil rice and boil fish (NO CAT FOOD). Litter box and Carry box will be provided. Who ever gonna adopt her will have send regular basis pictures of her till 1 month(Sorry).",
    comments: [
      {
        id: 0,
        name: "Nahian Khan",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "Just now",
      },
      {
        id: 1,
        name: "Nusrat Fariha",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "September 1, 2024 at 5:39 PM",
      },
      {
        id: 2,
        name: "John Doe",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "J",
        uploaded: "August 2, 2024 at 3:15 PM",
      },
    ],
  },
  {
    id: 2,
    name: "Golden",
    pet: "Dog",
    location: "Dhaka, Dhaka District, Dhaka Division, Bangladesh",
    addedOn: "April 2, 2023",
    pic: "/adoption/adopt3.jpeg",
    breed: "Spitz",
    gender: "Male",
    age: "+60 months",
    size: "Regular",
    postedBy: {
      name: "Aminul Islam",
      profilePic: "A",
      memberSince: "April, 2024",
    },
    vaccinated: "Yes",
    neutered: "Yes",
    description:
      "Hey everyone, this is Flume. He's 6 years old and we got him around 2018 and he's the friendliest boy ever. We had to give him up for adoption in 2019 sadly due to personal reasons but he's been with his second owner since then. They never had any complaints about him until now. Suddenly, they say he's become aggressive and they don't want to keep him anymore(after 6 years of keeping him and not complaining to us once). They warned us that if we don't find someone, they'll leave him on the streets. Flume wasn't with us for long, but he was my first ever pet, and I've always loved him deeply. Now, being in America, I can't even take him back. Please, if you have any space or are looking to adopt a dog, message me. Even temporary shelter would be appreciated. If anyone out there can help in the slightest, please message me.",
    comments: [
      {
        id: 0,
        name: "Nahian Khan",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "Just now",
      },
      {
        id: 1,
        name: "Nusrat Fariha",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "September 1, 2024 at 5:39 PM",
      },
      {
        id: 2,
        name: "John Doe",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "J",
        uploaded: "August 2, 2024 at 3:15 PM",
      },
    ],
  },
  {
    id: 3,
    name: "Kuchu",
    pet: "Dog",
    location: "Dupchanchia, Bogra District, Rajshahi Division, Bangladesh",
    addedOn: "July 3, 2024",
    pic: "/adoption/adopt4.jpg",
    breed: "Local/Deshi",
    gender: "Male",
    age: "6-12 months",
    size: "Small",
    postedBy: {
      name: "Aminul Islam",
      profilePic: "A",
      memberSince: "April, 2024",
    },
    vaccinated: "Yes",
    neutered: "No",
    description:
      "He is very dear to me, i have been taking care of him since it's birth. He is very calm and friendly. I want to give it for adoption as I have to move out for work and there is no one to take care of him",
    comments: [
      {
        id: 0,
        name: "Nahian Khan",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "Just now",
      },
      {
        id: 1,
        name: "Nusrat Fariha",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "N",
        uploaded: "September 1, 2024 at 5:39 PM",
      },
      {
        id: 2,
        name: "John Doe",
        comment:
          "Non laboris esse ullamco velit ad elit dolore cillum cillum qui.",
        profilePic: "J",
        uploaded: "August 2, 2024 at 3:15 PM",
      },
    ],
  },
];

export default AdoptionData;
