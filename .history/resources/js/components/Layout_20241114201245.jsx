/* eslint-disable */
import React from "react";
import {
    Sidebar,
    Menu,
    MenuItem,
    useProSidebar,
    SubMenu,
} from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import MapIcon from "@mui/icons-material/Map";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";
import DialerSipIcon from "@mui/icons-material/DialerSip";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookIcon from "@mui/icons-material/Book";
import SearchIcon from '@mui/icons-material/Search';
import CommentIcon from "@mui/icons-material/Comment";
import "../../css/app.css";
import "../../images/logo.png";
function Layout({ children }) {
    const { collapseSidebar } = useProSidebar();
    return (
        <>
            <div className="row w-100"></div>
            <div style={({ height: "90vh" }, { display: "flex" })}>
                <Sidebar style={{ minHeight: "100vh" }}>
                    <Menu>
                        <MenuItem
                            icon={<MenuOutlinedIcon />}
                            onClick={() => {
                                collapseSidebar();
                            }}
                            style={{ textAlign: "center", marginTop: "20px" }}
                        >
                            <img
                                src="https://foxshop.trungthanhzone.com/static/media/logo.95843af8a78d16fa99cc.png"
                                alt="Logo"
                                width={"100px"}
                                height={"100px"}
                            />
                        </MenuItem>
                        <SubMenu label="Tài khoản" icon={<GroupIcon />}>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/permissions"}
                            >
                                <MenuItem icon={<GroupIcon />}>
                                    Quyền tài khoản
                                </MenuItem>
                            </a>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/roles"}
                            >
                                <MenuItem icon={<GroupIcon />}>
                                    Loại tài khoản
                                </MenuItem>
                            </a>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/users"}
                            >
                                <MenuItem icon={<GroupIcon />}>
                                    Tài khoản
                                </MenuItem>
                            </a>
                        </SubMenu>
                        <SubMenu label="Sản phẩm" icon={<GroupIcon />}>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/categories"}
                            >
                                <MenuItem icon={<GroupIcon />}>
                                    Danh mục sản phẩm
                                </MenuItem>
                            </a>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/brands"}
                            >
                                <MenuItem icon={<GroupIcon />}>
                                    Thương hiệu
                                </MenuItem>
                            </a>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/attributes"}
                            >
                                <MenuItem icon={<GroupIcon />}>
                                    Thuộc tính
                                </MenuItem>
                            </a>
                            <SubMenu
                                label="Quản lý sản phẩm"
                                icon={<GroupIcon />}
                            >
                                <a
                                    className="text-decoration-none text-dark"
                                    href={"/admin/products"}
                                >
                                    <MenuItem icon={<GroupIcon />}>
                                        Thêm sản phẩm
                                    </MenuItem>
                                </a>
                                <a
                                    className="text-decoration-none text-dark"
                                    href={"/admin/products"}
                                >
                                    <MenuItem icon={<GroupIcon />}>
                                        Danh sách
                                    </MenuItem>
                                </a>
                            </SubMenu>
                        </SubMenu>
                        <SubMenu label="Bài đăng" icon={<BookIcon />}>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/posts"}
                            >
                                <MenuItem icon={<BookIcon />}>
                                    Danh sách bài viết
                                </MenuItem>
                            </a>
                            <a
                                className="text-decoration-none text-dark"
                                href={"/admin/posts"}
                            >
                                <MenuItem icon={<BookIcon />}>
                                    Thêm mới bài viết
                                </MenuItem>
                            </a>
                        </SubMenu>
                        {/* <SubMenu label="Sản phẩm" icon={<BrandingWatermarkIcon />}>
							<a className="text-decoration-none" href={"/admin/categories"}>
								<MenuItem icon={<CategoryIcon />}>Loại sản phẩm</MenuItem>
							</a>
							<a href={"/admin/brands"}>
								<MenuItem icon={<BrandingWatermarkIcon />}>Thương hiệu</MenuItem>
							</a>
							<a href={"/admin/products"}>
								<MenuItem icon={<InventoryIcon />}>Sản phẩm</MenuItem>
							</a>
						</SubMenu>
						<a href={"/admin/contacts"}>
							<MenuItem icon={<DialerSipIcon />}>Liên hệ</MenuItem>
						</a>
						<a href={"/admin/bookings"}>
							<MenuItem icon={<CalendarMonthIcon />}>Đặt lịch</MenuItem>
						</a>
						<a href={"/admin/slides"}>
							<MenuItem icon={<DriveFileMoveIcon />}>Slides</MenuItem>
						</a>
						<a href={"/admin/sitemap"}>
							<MenuItem icon={<MapIcon />}>Sitemap</MenuItem>
						</a>

						<a href={"/admin/comments"}>
							<MenuItem icon={<CommentIcon />}>Bình luận</MenuItem>
						</a>
						<a href={"/admin/bills"}>
							<MenuItem icon={<CardTravelIcon />}>Hoá đơn</MenuItem>
						</a>
						<SubMenu label="Hóa Đơn dịch vụ" icon={<BrandingWatermarkIcon />}>
							<a href={"/service-bills"}>
								<MenuItem icon={<CategoryIcon />}>Hóa đơn</MenuItem>
							</a>
						</SubMenu>
						<a href={"/campains"}>
							<MenuItem icon={<CardTravelIcon />}>Chiến dịch</MenuItem>
						</a>
						<SubMenu label="Dịch vụ" icon={<BrandingWatermarkIcon />}>
							<a href={"/service-collections"}>
								<MenuItem icon={<DesignServicesTwoToneIcon />}>Nhóm Dịch vụ </MenuItem>
							</a>
							<a href={"/services"}>
								<MenuItem icon={<DesignServicesTwoToneIcon />}>Dịch vụ </MenuItem>
							</a>
						</SubMenu> */}
                        <a href={"/logout"}>
                            <MenuItem icon={<LogoutIcon />}>Log out</MenuItem>
                        </a>

                        {/*             
            <MenuItem icon={<ReceiptOutlinedIcon />}>Profile</MenuItem>
            <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
            <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem> */}
                    </Menu>
                </Sidebar>
                <main className="w-100 relative">
                    <div>
                        <div className="header_navbar shadow fixed">
                            <div className="row">
                                <div className="col-8 p-4">
                                </div>
                                <div className="col-4"></div>
                            </div>
                        </div>
                    </div>
                    <div>{children}</div>
                </main>
            </div>
        </>
    );
}

export default Layout;
