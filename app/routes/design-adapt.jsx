import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'AIVELA | Design Adapt Demo'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context}) {
  const {storefront} = context;
  const {products} = await storefront.query(DESIGN_ADAPT_PRODUCTS_QUERY);
  return {
    products: products.nodes,
  };
}

export default function DesignAdaptPage() {
  /** @type {LoaderData} */
  const {products} = useLoaderData();
  const {open} = useAside();
  const [selectedColor, setSelectedColor] = useState('black');

  const heroProduct = products[0];
  const listProducts = products.slice(1, 5);
  const heroVariant = heroProduct ? getFirstAvailableVariant(heroProduct) : null;
  const heroTitle = heroProduct?.title || '重新定义健康生活方式';
  const heroDesc =
    heroProduct?.description ||
    '轻盈设计，强大功能。全天候健康监测，让科技融入生活每一刻。';

  return (
    <div className="design-adapt-page">
      <nav className="design-adapt-nav">
        <div className="design-adapt-brand">智慧环</div>
        <a className="design-adapt-buy-now" href="#cta">
          立即购买
        </a>
      </nav>

      <section className="design-adapt-hero">
        <div>
          <h1>{heroTitle}</h1>
          <p>{heroDesc}</p>
          <div className="design-adapt-hero-actions">
            {heroProduct ? (
              <Link to={`/products/${heroProduct.handle}`} className="design-adapt-link">
                查看商品详情
              </Link>
            ) : (
              <Link to="/collections/all" className="design-adapt-link">
                浏览全部商品
              </Link>
            )}
            {heroVariant ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: heroVariant.id,
                    quantity: 1,
                    selectedVariant: heroVariant,
                  },
                ]}
                onClick={() => open('cart')}
              >
                立即加入购物车
              </AddToCartButton>
            ) : null}
          </div>
          <div className="design-adapt-hero-points">
            <span>✓ 7天续航</span>
            <span>✓ 5ATM防水</span>
            <span>✓ 医疗级传感器</span>
          </div>
        </div>
        <div className="design-adapt-hero-image">
          <img src={FIGMA_HERO_IMAGE} alt="AIVELA hero" />
        </div>
      </section>

      <section className="design-adapt-colors">
        <h3>选择于你的专属配色</h3>
        <div className="design-adapt-colors-row">
          {FIGMA_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`design-adapt-color-item${
                selectedColor === color.value ? ' active' : ''
              }`}
              onClick={() => setSelectedColor(color.value)}
            >
              <span
                className="design-adapt-color-dot"
                style={{backgroundColor: color.hex}}
              />
              <span>{color.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="design-adapt-grid">
        {listProducts.length > 0 ? (
          listProducts.map((product, index) => {
            const variant = getFirstAvailableVariant(product);
            return (
              <article key={product.id} className="design-adapt-card">
                <Link to={`/products/${product.handle}`} className="design-adapt-card-image">
                  <img
                    src={FIGMA_PRODUCT_IMAGES[index % FIGMA_PRODUCT_IMAGES.length]}
                    alt={product.title}
                  />
                </Link>
                <h2>{product.title}</h2>
                <p>{product.description || 'AIVELA product.'}</p>
                <div className="design-adapt-card-actions">
                  <Link to={`/products/${product.handle}`} className="design-adapt-link">
                    详情
                  </Link>
                  {variant ? (
                    <AddToCartButton
                      lines={[
                        {
                          merchandiseId: variant.id,
                          quantity: 1,
                          selectedVariant: variant,
                        },
                      ]}
                      onClick={() => open('cart')}
                    >
                      加购
                    </AddToCartButton>
                  ) : (
                    <button type="button" disabled>
                      已售罄
                    </button>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          FIGMA_FALLBACK_PRODUCTS.map((item) => (
            <article key={item.title} className="design-adapt-card">
              <div className="design-adapt-card-image">
                <img src={item.image} alt={item.title} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <div className="design-adapt-card-actions">
                <Link to="/collections/all" className="design-adapt-link">
                  了解更多
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="design-adapt-features">
        <h2>强大功能，尽在指尖</h2>
        <div className="design-adapt-features-grid">
          {FIGMA_FEATURES.map((item) => (
            <article key={item.title} className="design-adapt-feature-item">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="design-adapt-specs">
        <h2>精工细作，匠心品质</h2>
        <div className="design-adapt-specs-grid">
          <img src={FIGMA_SPECS_IMAGE} alt="智能戒指细节" />
          <div className="design-adapt-spec-list">
            {FIGMA_SPECS.map((spec) => (
              <div key={spec.label} className="design-adapt-spec-item">
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="design-adapt-scenarios">
        <h2>适配您的每一天</h2>
        <div className="design-adapt-scenarios-grid">
          {FIGMA_SCENARIOS.map((item) => (
            <article key={item.title}>
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="design-adapt-cta" id="cta">
        <h2>开启智慧健康新生活</h2>
        <p>现在订购，享受限时优惠</p>
        <div className="design-adapt-cta-actions">
          {heroVariant ? (
            <AddToCartButton
              lines={[
                {
                  merchandiseId: heroVariant.id,
                  quantity: 1,
                  selectedVariant: heroVariant,
                },
              ]}
              onClick={() => open('cart')}
            >
              立即购买 ¥2,999
            </AddToCartButton>
          ) : (
            <Link to="/collections/all" className="design-adapt-link">
              立即购买 ¥2,999
            </Link>
          )}
          <button type="button" className="design-adapt-cta-outline">
            预约体验
          </button>
        </div>
        <div className="design-adapt-cta-points">
          <span>✓ 30天无理由退换</span>
          <span>✓ 全国联保</span>
          <span>✓ 免费配送</span>
          <span>✓ 专属客服</span>
        </div>
      </section>
    </div>
  );
}

/**
 * @param {DesignAdaptProduct} product
 */
function getFirstAvailableVariant(product) {
  return (
    product.variants.nodes.find((variant) => variant.availableForSale) ||
    product.variants.nodes[0] ||
    null
  );
}

const DESIGN_ADAPT_PRODUCTS_QUERY = `#graphql
  fragment DesignAdaptVariant on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    product {
      handle
      title
    }
  }

  fragment DesignAdaptProduct on Product {
    id
    title
    handle
    description
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 10) {
      nodes {
        ...DesignAdaptVariant
      }
    }
  }

  query DesignAdaptProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...DesignAdaptProduct
      }
    }
  }
`;

const FIGMA_HERO_IMAGE =
  'https://images.unsplash.com/photo-1758577515333-e71b713059f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const FIGMA_SPECS_IMAGE =
  'https://images.unsplash.com/photo-1760088348194-a5ac70a8aa9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const FIGMA_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1760088348194-a5ac70a8aa9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1744697307482-0f55e2e0c1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1651752090085-50375d90bf8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const FIGMA_COLORS = [
  {name: '曜石黑', value: 'black', hex: '#111111'},
  {name: '星空银', value: 'silver', hex: '#d1d5db'},
  {name: '玫瑰金', value: 'gold', hex: '#b45309'},
];

const FIGMA_FALLBACK_PRODUCTS = [
  {
    title: '曜石黑',
    desc: '经典配色，低调耐看，适配商务与日常场景。',
    image:
      'https://images.unsplash.com/photo-1760088348194-a5ac70a8aa9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: '星空银',
    desc: '极简金属质感，轻盈外观，现代科技风格。',
    image:
      'https://images.unsplash.com/photo-1744697307482-0f55e2e0c1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: '玫瑰金',
    desc: '温润高级配色，适合日常通勤与穿搭点缀。',
    image:
      'https://images.unsplash.com/photo-1651752090085-50375d90bf8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

const FIGMA_FEATURES = [
  {title: '心率监测', desc: '24小时连续心率监测，及时提示异常波动。'},
  {title: '睡眠分析', desc: '自动识别睡眠阶段，输出更直观的健康趋势。'},
  {title: '运动追踪', desc: '识别多种运动模式，记录卡路里与活动时长。'},
  {title: '血氧检测', desc: '便捷查看血氧水平变化，辅助日常状态管理。'},
  {title: '压力管理', desc: '根据节律估算压力负荷，提供放松建议。'},
  {title: '智能提醒', desc: '消息、久坐、来电提醒，减少遗漏重要事件。'},
];

const FIGMA_SCENARIOS = [
  {
    title: '商务办公',
    desc: '隐形佩戴风格，会议与办公场景都能自然融入。',
    image:
      'https://images.unsplash.com/photo-1744697311586-52d32d9c1974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: '运动健身',
    desc: '记录运动表现，帮助建立稳定训练节奏。',
    image:
      'https://images.unsplash.com/photo-1744697307482-0f55e2e0c1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: '日常生活',
    desc: '全天候健康数据沉淀，形成长期可追踪报告。',
    image:
      'https://images.unsplash.com/photo-1651752090085-50375d90bf8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

const FIGMA_SPECS = [
  {label: '材质', value: '钛合金机身 + 蓝宝石玻璃'},
  {label: '重量', value: '仅 2.5g，轻若无物'},
  {label: '尺寸', value: '6-13号可选，精准贴合'},
  {label: '续航', value: '7天持久续航，磁吸充电'},
  {label: '防水', value: '5ATM防水，游泳佩戴无忧'},
  {label: '传感器', value: 'PPG心率 + 加速度计 + 陀螺仪'},
  {label: '连接', value: '蓝牙5.2，兼容iOS/Android'},
  {label: '存储', value: '7天健康数据本地存储'},
];

/** @typedef {import('./+types/design-adapt').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderData */
/** @typedef {LoaderData['products'][number]} DesignAdaptProduct */
