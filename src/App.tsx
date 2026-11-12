import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  Activity, Archive, ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight,
  ArrowUpRight, Bell, Box, CalendarDays, Check, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Clock3, CreditCard,
  Download, Ellipsis, ExternalLink, Eye, Filter, Home, Layers3, LayoutDashboard,
  LifeBuoy, ListFilter, LockKeyhole, Menu, Moon, MoreHorizontal, Package,
  PackageCheck, PackagePlus, Plus, Printer, Search, Settings, ShieldCheck,
  ShoppingBag, SlidersHorizontal, Sun, Tag, Truck, Users, Warehouse, X,
  Zap, RotateCcw
} from "lucide-react";

type Page = "Overview" | "Fulfillment" | "Inventory" | "Orders";
type OrderStatus = "To pack" | "Packing" | "Ready to ship" | "Shipped";
type Product = { id:number; name:string; sku:string; category:string; stock:number; reorder:number; sold:number; days:number; cost:number; color:string };
type Order = { id:number; name:string; initials:string; color:string; city:string; age:string; status:OrderStatus; items:string[]; total:number; carrier:string; note?:string };

const initialProducts: Product[] = [
  {id:1,name:"Letterpress Card Pack",sku:"STA-192",category:"Stationery",stock:0,reorder:20,sold:3.6,days:0,cost:8.5,color:"mint"},
  {id:2,name:"Beeswax Taper Candles",sku:"HOM-118",category:"Home",stock:3,reorder:30,sold:2.6,days:1,cost:8.68,color:"lime"},
  {id:3,name:"Cedar & Moss Soap",sku:"BAT-164",category:"Bath",stock:12,reorder:24,sold:1.8,days:4,cost:5.2,color:"pink"},
  {id:4,name:"Enamel Water Bottle",sku:"KIT-220",category:"Kitchen",stock:18,reorder:24,sold:2.1,days:6,cost:12.4,color:"orange"},
  {id:5,name:"Linen Throw Blanket",sku:"HOM-305",category:"Home",stock:42,reorder:20,sold:1.2,days:14,cost:28.0,color:"blue"},
  {id:6,name:"Ceramic Bud Vase",sku:"HOM-087",category:"Home",stock:7,reorder:18,sold:1.4,days:3,cost:14.0,color:"green"},
  {id:7,name:"Dot Grid Notebook B5",sku:"STA-201",category:"Stationery",stock:56,reorder:24,sold:4.2,days:19,cost:4.5,color:"blue"},
  {id:8,name:"Rattan Storage Basket",sku:"HOM-412",category:"Home",stock:31,reorder:16,sold:1.1,days:20,cost:16.0,color:"orange"}
];

const initialOrders: Order[] = [
  {id:15954,name:"Leo Sorensen",initials:"LS",color:"pink",city:"Savannah, GA",age:"10 h",status:"To pack",items:["Linen Napkins ×2"],total:81.47,carrier:"USPS",note:"Leave at the side door"},
  {id:15955,name:"Cole Reyes",initials:"CR",color:"orange",city:"Portland, OR",age:"9 h",status:"To pack",items:["Cotton Canvas Tote ×2"],total:67.53,carrier:"UPS"},
  {id:15956,name:"Juniper & Pine",initials:"JP",color:"mint",city:"Austin, TX",age:"7 h",status:"To pack",items:["Wool Beanie ×1","Dot Grid Notebook ×5"],total:188.10,carrier:"USPS"},
  {id:15963,name:"Esme Hale",initials:"EH",color:"lime",city:"Brooklyn, NY",age:"1 h",status:"Packing",items:["Beeswax Taper Candles ×1","Fountain Pen ×3"],total:180.10,carrier:"UPS"},
  {id:15964,name:"Hugo Adeyemi",initials:"HA",color:"mint",city:"Chicago, IL",age:"53 min",status:"Packing",items:["Bath Salt Jar ×2","Glass Pour-Over Set ×1"],total:63.24,carrier:"USPS"},
  {id:15945,name:"Silas Hale",initials:"SH",color:"mint",city:"Denver, CO",age:"24 h",status:"Ready to ship",items:["Linen Throw Blanket ×1","Ceramic Bud Vase ×1","Wooden Serving Board ×1"],total:235.84,carrier:"UPS"},
  {id:15953,name:"Zara Sato",initials:"ZS",color:"orange",city:"Seattle, WA",age:"18 h",status:"Shipped",items:["Waffle Bath Towel ×1"],total:56.81,carrier:"UPS"},
  {id:15952,name:"Ava Fenwick",initials:"AF",color:"pink",city:"Boston, MA",age:"19 h",status:"Shipped",items:["Beeswax Taper Candles ×1","Glass Pour-Over Set ×1"],total:79.11,carrier:"USPS"},
  {id:15951,name:"Wren Marsh",initials:"WM",color:"purple",city:"Nashville, TN",age:"21 h",status:"Shipped",items:["Rattan Storage Basket ×1","Letterpress Card Pack ×2"],total:126.50,carrier:"UPS"}
];

const navItems: {label:Page; icon:any}[] = [
  {label:"Overview",icon:Home},{label:"Fulfillment",icon:PackageCheck},{label:"Inventory",icon:Warehouse},{label:"Orders",icon:ClipboardList}
];
const allNav = [
  {label:"Customers",icon:Users},{label:"Products",icon:ShoppingBag},{label:"Analytics",icon:Activity},
  {label:"Discounts",icon:Tag},{label:"Reports",icon:Layers3},{label:"Settings",icon:Settings}
];
const money=(n:number)=>"$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const productIcon=(p:Product)=><span className={`product-icon ${p.color}`}><Package size={15}/></span>;

function Sparkline({color="#9a8cff"}:{color?:string}) {
  return <svg className="sparkline" viewBox="0 0 100 28" preserveAspectRatio="none"><path d="M0 20 C8 4 13 23 22 14 S37 6 45 17 S59 25 67 10 S80 5 88 15 S95 10 100 7" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>;
}
function SalesChart({period}:{period:string}) {
  const [compare,setCompare]=useState(true);
  return <div className="chart-card panel">
    <div className="panel-head"><div><div className="muted tiny">Sales</div><div className="tiny muted">563 orders · daily, last 30 days</div></div><div className="chart-controls"><button className={compare?"pill active":"pill"} onClick={()=>setCompare(!compare)}><Activity size={12}/> Compare</button>{["7D","30D","90D","12M"].map(p=><button key={p} className={`pill ${period===p?"selected":""}`}>{p}</button>)}</div></div>
    <div className="chart-total">$53,002 <span className="positive">↗ 8%</span></div>
    <div className="line-chart">
      <svg viewBox="0 0 620 210" preserveAspectRatio="none">
        <defs><linearGradient id="lineGlow" x1="0" x2="1"><stop stopColor="#8c70ff"/><stop offset="1" stopColor="#54d5f2"/></linearGradient><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#7b6bff" stopOpacity=".26"/><stop offset="1" stopColor="#7b6bff" stopOpacity="0"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        {[40,85,130,175].map(y=><line key={y} x1="0" y1={y} x2="620" y2={y} stroke="#27283b" strokeDasharray="3 5"/>)}
        {compare&&<path d="M0 132 C28 120 34 165 60 140 S100 93 130 131 S170 153 190 115 S230 139 255 143 S290 98 318 125 S350 165 380 136 S420 122 448 140 S480 98 505 125 S550 144 580 115 S600 135 620 122" fill="none" stroke="#74708d" strokeDasharray="5 6" strokeWidth="2" opacity=".6"/>}
        <path d="M0 150 C22 132 24 84 50 120 S78 171 105 112 S140 80 158 132 S195 155 215 110 S246 165 270 137 S300 52 324 91 S350 164 376 118 S405 38 426 88 S452 151 474 102 S497 145 520 115 S545 44 564 76 S595 140 620 112 L620 210 L0 210Z" fill="url(#area)"/>
        <path d="M0 150 C22 132 24 84 50 120 S78 171 105 112 S140 80 158 132 S195 155 215 110 S246 165 270 137 S300 52 324 91 S350 164 376 118 S405 38 426 88 S452 151 474 102 S497 145 520 115 S545 44 564 76 S595 140 620 112" fill="none" stroke="url(#lineGlow)" strokeWidth="3" strokeLinecap="round" filter="url(#glow)"/>
        <circle cx="620" cy="112" r="4" fill="#dffaff"/>
      </svg>
      <div className="chart-dates"><span>Oct 12</span><span>Oct 18</span><span>Oct 24</span><span>Oct 29</span><span>Nov 4</span><span>Nov 10</span></div>
    </div>
    <div className="legend"><span><i className="blue-line"/> This period</span>{compare&&<span><i className="dotted-line"/> The period before</span>}</div>
  </div>;
}
function GoalCard() {
  return <div className="goal-card panel"><div className="panel-head"><div><b>November goal</b><div className="muted tiny">20 days to go</div></div><button className="icon-button"><Ellipsis size={16}/></button></div>
    <div className="goal-ring"><svg viewBox="0 0 160 110"><path d="M22 95 A58 58 0 0 1 138 95" fill="none" stroke="#292b40" strokeWidth="12" strokeLinecap="round"/><path d="M22 95 A58 58 0 0 1 138 95" fill="none" stroke="url(#goalGradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray="182" strokeDashoffset="96"/><defs><linearGradient id="goalGradient"><stop stopColor="#9877ff"/><stop offset="1" stopColor="#6ce0f1"/></linearGradient></defs><circle cx="80" cy="37" r="4" fill="#d6eaff"/></svg><div className="goal-number">47%<small>of $42k</small></div></div>
    <div className="goal-stats"><div><span>Booked</span><b>$19,683</b></div><div><span>Needed a day</span><b>$1,063</b></div><div><span>On pace for</span><b>$60,051</b></div></div>
  </div>;
}
function Avatar({initials,color}:{initials:string;color:string}) { return <span className={`avatar ${color}`}>{initials}</span>; }

function Overview({orders,onOpen}:{orders:Order[];onOpen:(o:Order)=>void}) {
  return <div className="page-content">
    <div className="page-intro"><div><div className="muted tiny">Tue, Nov 10</div><h1>Good evening, Mara</h1><p>15 orders so far today, <b>$1,236</b> in sales. <span className="accent-text">13 waiting to be packed.</span></p></div><div className="intro-actions"><button className="button ghost"><Activity size={13}/> Analytics</button><button className="button primary"><PackageCheck size={13}/> Start packing</button></div></div>
    <div className="metric-grid">
      <Metric label="Today so far" value="$1,236" sub="↘ 9% vs last Tue" tone="negative"/>
      <Metric label="Last 7 days" value="$13,732" sub="↗ 3% vs the week before" tone="positive"/>
      <Metric label="Orders today" value="15" sub="↗ 0% vs last week" tone="positive"/>
      <div className="metric"><span className="muted tiny">Average order</span><strong>$88.59</strong><Sparkline/><span className="muted tiny"> </span></div>
    </div>
    <div className="overview-grid"><SalesChart period="30D"/><GoalCard/></div>
    <div className="bottom-widgets">
      <div className="panel latest"><div className="panel-head"><div><b><i className="live-dot"/> Latest orders</b><div className="muted tiny">New ones arrive here as they're placed</div></div><button className="text-button">All orders</button></div>
        {orders.slice(0,3).map(o=><button className="latest-row" key={o.id} onClick={()=>onOpen(o)}><Avatar initials={o.initials} color={o.color}/><span className="latest-name"><b>{o.name}</b><small>#{o.id} · {o.items[0]}</small></span><span className="latest-price"><b>{money(o.total)}</b><small>{o.age} ago</small></span></button>)}
      </div>
      <div className="panel running-low"><div className="panel-head"><div><b>Running low</b><div className="muted tiny">4 at or under their reorder point</div></div><span className="text-button">Inventory</span></div><div className="mini-tubes">{[3,1,0,2].map((v,i)=><div className="mini-tube-wrap" key={i}><div className="mini-tube"><i style={{height:`${[38,25,12,45][i]}%`}}/></div><small>{["3d","1d","Out","2d"][i]}</small></div>)}</div></div>
      <div className="panel sales-source"><div className="panel-head"><div><b>Where sales came from</b><div className="muted tiny">Last 30 days</div></div></div><div className="source-donut"><div><b>$53k</b><small>30 days</small></div></div><div className="source-legend"><span>Online store</span><b>68%</b><span>Social</span><b>22%</b></div></div>
    </div>
  </div>;
}
function Metric({label,value,sub,tone}:{label:string;value:string;sub:string;tone:string}) { return <div className="metric"><span className="muted tiny">{label}</span><strong>{value}</strong><span className={`metric-sub ${tone}`}>{sub}</span></div>; }

const columns: OrderStatus[]=["To pack","Packing","Ready to ship","Shipped"];
function Fulfillment({orders,setOrders,onOpen}:{orders:Order[];setOrders:(o:Order[])=>void;onOpen:(o:Order)=>void}) {
  const [dragId,setDragId]=useState<number|null>(null);
  function move(id:number,status:OrderStatus){setOrders(orders.map(o=>o.id===id?{...o,status}:o));}
  return <div className="page-content">
    <div className="page-intro"><div><h1>Fulfillment</h1><p>Drag an order to the next column, or focus it and press <kbd>↵</kbd> Enter opens it.</p></div><button className="button ghost" onClick={()=>window.print()}><Printer size={13}/> Print packing slips</button></div>
    <div className="fulfillment-metrics"><Metric label="Waiting" value="14" sub="38 items to pick" tone=""/><Metric label="Oldest order" value="24h" sub="#15945" tone=""/><Metric label="Shipped today" value="12" sub="Cut-off for today's pickup 4:00 PM" tone=""/><div className="metric"><span className="muted tiny">Today's queue</span><strong className="queue-value">46% done</strong><div className="queue-bar"><i/></div></div></div>
    <div className="kanban">{columns.map((col,idx)=>{const list=orders.filter(o=>o.status===col);return <div className="kanban-col" key={col} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragId!==null)move(dragId,col);setDragId(null);}}>
      <div className="kanban-head"><div><b>{col}</b><small>{["Paid and waiting, oldest first","On the bench now","Boxed and labeled","Handed to the carrier today"][idx]}</small></div><span className="count">{list.length}</span></div>
      {idx===0&&<button className="take-next" onClick={()=>{const o=list[0];if(o)move(o.id,"Packing");}}>Take next</button>}
      {idx===2&&<button className="ship-all" onClick={()=>setOrders(orders.map(o=>o.status==="Ready to ship"?{...o,status:"Shipped"}:o))}><Truck size={11}/> Ship all</button>}
      <div className="kanban-cards">{list.map(o=><div className="order-card" key={o.id} draggable onDragStart={()=>setDragId(o.id)} onClick={()=>onOpen(o)} onKeyDown={e=>e.key==="Enter"&&onOpen(o)} tabIndex={0}>
        <div className="order-card-top"><b>#{o.id}</b><small><Clock3 size={10}/> {o.age}</small></div><div className="customer"><Avatar initials={o.initials} color={o.color}/><b>{o.name}</b></div>
        {o.items.map((item,i)=><div className="order-item" key={i}><span className="item-square">{i+1}</span><span>{item}</span></div>)}
        {o.note&&<div className="order-note">▧ {o.note}</div>}
        <div className="order-card-bottom"><span>{o.items.length} items · {money(o.total)}</span><button onClick={e=>{e.stopPropagation();move(o.id,columns[Math.min(idx+1,3)]);}}>{idx===3?"Details":columns[Math.min(idx+1,3)]} <ArrowRight size={10}/></button></div>
      </div>)}</div>
    </div>})}</div>
  </div>;
}

function Inventory({products,setProducts,onRestock}:{products:Product[];setProducts:(p:Product[])=>void;onRestock:(p:Product)=>void}) {
  const [filter,setFilter]=useState("All");
  const filtered=products.filter(p=>filter==="All"||(filter==="Low"&&p.stock>0&&p.stock<=p.reorder)||(filter==="Sold out"&&p.stock===0));
  const categories=["Home","Kitchen","Apparel","Bath","Stationery"];
  return <div className="page-content">
    <div className="page-intro"><div><h1>Inventory</h1><p>Each tube is a product: the liquid is what's on the shelf, the line is where you reorder.</p></div><button className="button ghost"><Download size={13}/> Purchase list</button></div>
    <div className="inventory-metrics">
      <Metric label="Units on hand" value={products.reduce((s,p)=>s+p.stock,0).toLocaleString()} sub={`${products.length} active products`} tone=""/>
      <Metric label="Stock value at cost" value={money(products.reduce((s,p)=>s+p.stock*p.cost,0))} sub="$65,722 at retail" tone=""/>
      <Metric label="At or under reorder" value={String(products.filter(p=>p.stock<=p.reorder).length)} sub="3 run out within a week" tone="warning"/>
      <Metric label="Sold out" value={String(products.filter(p=>p.stock===0).length)} sub="Hidden from the store until restocked" tone="negative"/>
    </div>
    <div className="panel shelf-panel"><div className="panel-head"><div><b>The shelf</b><div className="muted tiny">Grouped by category, emptiest first</div></div><div className="legend"><span><i className="key-blue"/> Above reorder</span><span><i className="key-orange"/> Reorder now</span><span><i className="key-line"/> Reorder point</span></div></div>
      <div className="shelves">{categories.map((cat,ci)=><div className="shelf-category" key={cat}><div className="tube-row">{products.filter(p=>p.category===cat).slice(0,5).map(p=><button className="tube-button" key={p.id} onClick={()=>onRestock(p)} title={`${p.name}: ${p.stock} units`}><div className={`stock-tube ${p.stock===0?"empty":p.stock<=p.reorder?"low":""}`}><i style={{height:`${Math.max(0,Math.min(100,p.stock/Math.max(p.reorder*2,1)*100))}%`}}/></div><small>{p.stock}</small></button>)}</div><span className="category-label">{cat}</span></div>)}</div>
    </div>
    <div className="table-toolbar"><div className="filter-pills">{["All","Low","Sold out"].map(f=><button className={filter===f?"active":""} key={f} onClick={()=>setFilter(f)}>{f} <span>{f==="All"?products.length:f==="Low"?products.filter(p=>p.stock>0&&p.stock<=p.reorder).length:products.filter(p=>p.stock===0).length}</span></button>)}</div><button className="button ghost"><SlidersHorizontal size={12}/> Filters</button></div>
    <div className="panel data-table"><div className="table-row table-header"><span>Product</span><span>In stock</span><span>Reorder at</span><span>Sells a day</span><span>Lasts</span><span></span></div>
      {filtered.map(p=><div className="table-row" key={p.id}><span className="product-cell">{productIcon(p)}<span><b>{p.name}</b><small>{p.sku}</small></span></span><b className={p.stock===0?"negative-text":p.stock<=p.reorder?"warning-text":""}>{p.stock}</b><span>{p.reorder}</span><span>{p.sold.toFixed(1)}</span><span className="lasts"><i style={{width:`${Math.min(100,p.days/30*100)}%`}}/>{p.days===0?"Out":`${p.days} d`}</span><button className="button tiny-button" onClick={()=>onRestock(p)}><Plus size={11}/> Restock</button></div>)}
    </div>
  </div>;
}

function Orders({orders,onOpen}:{orders:Order[];onOpen:(o:Order)=>void}) {
  const [query,setQuery]=useState(""); const [status,setStatus]=useState("All");
  const filtered=orders.filter(o=>(status==="All"||o.status===status)&&(`${o.id} ${o.name} ${o.city}`.toLowerCase().includes(query.toLowerCase())));
  return <div className="page-content">
    <div className="page-intro"><div><h1>Orders</h1><p>Every order, from checkout to the customer's doorstep.</p></div><button className="button primary"><Plus size={13}/> Create order</button></div>
    <div className="orders-toolbar"><div className="filter-pills">{["All","To pack","Packing","Ready to ship","Shipped"].map(s=><button className={status===s?"active":""} key={s} onClick={()=>setStatus(s)}>{s}</button>)}</div><label className="table-search"><Search size={13}/><input placeholder="Search orders..." value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
    <div className="panel orders-table"><div className="order-table-row header"><span>Order</span><span>Customer</span><span>Date</span><span>Status</span><span>Total</span><span></span></div>
      {filtered.map(o=><button className="order-table-row" key={o.id} onClick={()=>onOpen(o)}><b>#{o.id}</b><span className="customer-cell"><Avatar initials={o.initials} color={o.color}/>{o.name}</span><span>Nov 10, 10:03 AM</span><span><em className={`status-badge ${o.status.toLowerCase().replaceAll(" ","-")}`}>{o.status}</em></span><b>{money(o.total)}</b><ChevronRight size={14}/></button>)}
    </div>
  </div>;
}

function RestockModal({product,onClose,onSave}:{product:Product;onClose:()=>void;onSave:(id:number,qty:number)=>void}) {
  const [qty,setQty]=useState(74);
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal panel">
    <div className="modal-head"><div><b>Restock {product.name}</b><small>{product.stock} on hand · sells about {product.sold.toFixed(1)} a day</small></div><button className="icon-button" onClick={onClose}><X size={16}/></button></div>
    <div className="restock-body"><div className="restock-product">{productIcon(product)}<span className="restock-tube"><i style={{height:`${Math.min(100,product.stock/Math.max(product.reorder*2,1)*100)}%`}}/></span></div><div className="restock-fields"><label>Units arriving</label><div className="quantity"><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><input type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1,Number(e.target.value)))}/><button onClick={()=>setQty(qty+1)}>＋</button></div><div className="restock-info"><span>After restock <b>{product.stock+qty} units</b></span><span>Lasts about <b>{Math.round((product.stock+qty)/product.sold)} days</b></span><span>Cost <b>{money(product.cost*qty)}</b></span></div></div></div>
    <div className="modal-actions"><button className="button ghost" onClick={onClose}>Cancel</button><button className="button primary" onClick={()=>onSave(product.id,qty)}><Check size={13}/> Receive stock</button></div>
  </div></div>;
}
function OrderDrawer({order,onClose,onMove}:{order:Order;onClose:()=>void;onMove:(o:Order)=>void}) {
  return <div className="drawer-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="order-drawer"><div className="drawer-head"><div><h2>Order #{order.id}</h2><small>Nov 10, 10:03 AM · Online store</small></div><button className="icon-button" onClick={onClose}><X size={17}/></button></div>
    <div className="drawer-badges"><em className="status-badge paid">● Paid</em><em className={`status-badge ${order.status.toLowerCase().replaceAll(" ","-")}`}>● {order.status}</em></div>
    <div className="drawer-customer"><Avatar initials={order.initials} color={order.color}/><div><b>{order.name}</b><small>{order.name.toLowerCase().replaceAll(" ",".")}@mail.example · {order.city}</small></div></div>
    {order.note&&<div className="drawer-note">▧ {order.note}</div>}
    <h3>Items · {order.items.length}</h3>{order.items.map((it,i)=><div className="drawer-item" key={i}><span className="item-square">{i+1}</span><b>{it}</b><span>{money(order.total/order.items.length)}</span></div>)}
    <div className="totals"><span>Subtotal <b>{money(order.total-5.47)}</b></span><span>Shipping <b>Free</b></span><span>Tax <b>$5.47</b></span><span className="total"><b>Total</b><strong>{money(order.total)}</strong></span></div>
    <div className="tracking"><span>Carrier <b>{order.carrier}</b></span><span>Tracking <b>Added when shipped</b></span><span>Placed <b>{order.age} ago</b></span></div>
    <div className="drawer-actions"><button className="button ghost">Refund</button><button className="button ghost"><Printer size={12}/> Packing slip</button><button className="button primary" onClick={()=>onMove(order)}>{order.status==="Shipped"?"Mark delivered":"Mark packed"} <ArrowRight size={12}/></button></div>
  </aside></div>;
}

export default function App() {
  const [page,setPage]=useState<Page>("Overview");
  const [orders,setOrders]=useState(initialOrders);
  const [products,setProducts]=useState(initialProducts);
  const [selectedOrder,setSelectedOrder]=useState<Order|null>(null);
  const [restockProduct,setRestockProduct]=useState<Product|null>(null);
  const [search,setSearch]=useState("");
  const [dark,setDark]=useState(true);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [toast,setToast]=useState("");
  const [notifications,setNotifications]=useState(false);
  const [showCreate,setShowCreate]=useState(false);
  const shellRef=useRef<HTMLDivElement>(null);
  const toastTimer=useRef<number | undefined>(undefined);
  useEffect(()=>{if(shellRef.current)gsap.fromTo(shellRef.current.querySelectorAll(".panel,.metric,.page-intro"),{opacity:0,y:10},{opacity:1,y:0,duration:.45,stagger:.035,ease:"power2.out"});},[page]);
  function notify(message:string){setToast(message);window.clearTimeout(toastTimer.current);toastTimer.current=window.setTimeout(()=>setToast(""),2200);}
  function moveOrder(o:Order){const next:OrderStatus=o.status==="To pack"?"Packing":o.status==="Packing"?"Ready to ship":o.status==="Ready to ship"?"Shipped":"Shipped";setOrders(orders.map(x=>x.id===o.id?{...x,status:next}:x));setSelectedOrder(null);notify(`Order #${o.id} moved to ${next}`);}
  function receiveStock(id:number,qty:number){setProducts(products.map(p=>p.id===id?{...p,stock:p.stock+qty}:p));setRestockProduct(null);notify("Stock received successfully");}
  const title=page;
  return <div className={`app-shell ${dark?"dark":"light"}`} ref={shellRef}>
    <aside className={`sidebar ${sidebarOpen?"open":""}`}>
      <div className="brand-mark"><span>B</span></div>
      <nav className="side-nav">{navItems.map(item=><button key={item.label} className={page===item.label?"active":""} title={item.label} onClick={()=>{setPage(item.label);setSidebarOpen(false);}}><item.icon size={16}/><span>{item.label}</span></button>)}<div className="nav-separator"/>{allNav.map(item=><button key={item.label} title={item.label} onClick={()=>notify(`${item.label} module preview`)}><item.icon size={15}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-bottom"><button title="Help" onClick={()=>notify("Help center coming soon")}><CircleHelp size={16}/></button><button title="Settings" onClick={()=>notify("Settings coming soon")}><Settings size={16}/></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu icon-button" onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu size={17}/></button>
        <label className="global-search"><Search size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders, products, customers..."/><kbd>⌘K</kbd></label>
        <div className="top-actions"><button className="button primary create-btn" onClick={()=>setShowCreate(true)}><Plus size={13}/> Create</button><button className="icon-button" onClick={()=>setDark(!dark)} title="Toggle theme">{dark?<Sun size={15}/>:<Moon size={15}/>}</button><button className="icon-button notification-btn" onClick={()=>setNotifications(!notifications)}><Bell size={15}/><i/></button><Avatar initials="ME" color="peach"/></div>
        {notifications&&<div className="notification-pop panel"><b>Notifications</b><p>3 orders are waiting to be packed.</p><p>2 products are below reorder point.</p></div>}
      </header>
      <div className="content-scroll">
        {page==="Overview"&&<Overview orders={orders} onOpen={setSelectedOrder}/>}
        {page==="Fulfillment"&&<Fulfillment orders={orders} setOrders={setOrders} onOpen={setSelectedOrder}/>}
        {page==="Inventory"&&<Inventory products={products} setProducts={setProducts} onRestock={setRestockProduct}/>}
        {page==="Orders"&&<Orders orders={orders} onOpen={setSelectedOrder}/>}
      </div>
    </main>
    {selectedOrder&&<OrderDrawer order={selectedOrder} onClose={()=>setSelectedOrder(null)} onMove={moveOrder}/>}
    {restockProduct&&<RestockModal product={restockProduct} onClose={()=>setRestockProduct(null)} onSave={receiveStock}/>}
    {showCreate&&<div className="modal-backdrop"><div className="modal panel"><div className="modal-head"><b>Create a new order</b><button className="icon-button" onClick={()=>setShowCreate(false)}><X size={16}/></button></div><p className="muted small">Demo workspace — order creation form is a UI placeholder.</p><button className="button primary full" onClick={()=>{setShowCreate(false);notify("New order form is ready to connect to your API");}}>Got it</button></div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={14}/>{toast}</div>}
  </div>;
}
