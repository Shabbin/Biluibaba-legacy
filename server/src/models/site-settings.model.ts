import mongoose, { Schema, Model, Document, Types } from 'mongoose';

interface IImage {
  filename: string;
  path: string;
}

interface ICategory {
  category: string;
  categorySlug: string;
  image: string;
}

interface IBrand {
  name: string;
  slug: string;
  path: string;
}

interface IFeaturedAdoption {
  id: string;
  name: string;
  description: string;
  slug: string;
}

interface IBestDealsProduct {
  id: Types.ObjectId;
}

interface IBestDeals {
  duration: number;
  products: IBestDealsProduct[];
}

export interface ISiteSettings extends Document {
  _id: Types.ObjectId;
  product_landing_slider: IImage[];
  popular_product_category: ICategory[];
  featured_product?: Types.ObjectId;
  product_banner_one?: IImage;
  product_brands_in_spotlight: IBrand[];
  vet_landing_slider: IImage[];
  vet_banner_one?: IImage;
  vet_grid_banners: IImage[];
  adoption_banner_one?: IImage;
  adoption_banner_two?: IImage;
  featured_adoptions: IFeaturedAdoption[];
  adoption_landing_banner: IImage[];
  adoption_landing_banner_two: IImage[];
  best_deals: IBestDeals;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    filename: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const CategorySchema = new Schema<ICategory>(
  {
    category: String,
    categorySlug: String,
    image: String,
  },
  { _id: false }
);

const BrandSchema = new Schema<IBrand>(
  {
    name: String,
    slug: String,
    path: String,
  },
  { _id: false }
);

const FeaturedAdoptionSchema = new Schema<IFeaturedAdoption>(
  {
    id: String,
    name: String,
    description: String,
    slug: String,
  },
  { _id: false }
);

const BestDealsProductSchema = new Schema<IBestDealsProduct>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'ProductData',
    },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    product_landing_slider: {
      type: [ImageSchema],
      default: [],
    },
    popular_product_category: {
      type: [CategorySchema],
      default: [],
    },
    featured_product: {
      type: Schema.Types.ObjectId,
      ref: 'ProductData',
      default: null,
    },
    product_banner_one: {
      type: ImageSchema,
      default: { filename: '', path: '' },
    },
    product_brands_in_spotlight: {
      type: [BrandSchema],
      default: [],
    },
    vet_landing_slider: {
      type: [ImageSchema],
      default: [],
    },
    vet_banner_one: {
      type: ImageSchema,
      default: { filename: '', path: '' },
    },
    vet_grid_banners: {
      type: [ImageSchema],
      default: [],
    },
    adoption_banner_one: {
      type: ImageSchema,
      default: { filename: '', path: '' },
    },
    adoption_banner_two: {
      type: ImageSchema,
      default: { filename: '', path: '' },
    },
    featured_adoptions: {
      type: [FeaturedAdoptionSchema],
      default: [],
    },
    adoption_landing_banner: {
      type: [ImageSchema],
      default: [],
    },
    adoption_landing_banner_two: {
      type: [ImageSchema],
      default: [],
    },
    best_deals: {
      duration: {
        type: Number,
        default: 0,
      },
      products: {
        type: [BestDealsProductSchema],
        default: [],
      },
    },
  },
  {
    collection: 'site-settings',
    timestamps: true,
  }
);

const SiteSettings: Model<ISiteSettings> = mongoose.model<ISiteSettings>(
  'SiteSettings',
  SiteSettingsSchema
);

export default SiteSettings;
