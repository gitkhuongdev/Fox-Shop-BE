/* eslint-disable */
import React from "react";
import {
    Sidebar,
    Menu,
    MenuItem,
    useProSidebar,
    SubMenu,
} from "react-pro-sidebar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import "../../css/app.css";
function Layout({ children }) {
    const { collapseSidebar } = useProSidebar();
    const StyledBadge = styled(Badge)(({ theme }) => ({
        "& .MuiBadge-badge": {
            backgroundColor: "#44b700",
            color: "#44b700",
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "ripple 1.2s infinite ease-in-out",
                border: "1px solid currentColor",
                content: '""',
            },
        },
        "@keyframes ripple": {
            "0%": {
                transform: "scale(.8)",
                opacity: 1,
            },
            "100%": {
                transform: "scale(2.4)",
                opacity: 0,
            },
        },
    }));

    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 22,
        height: 22,
        border: `2px solid ${theme.palette.background.paper}`,
    }));
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
                        <div className="header_navbar shadow fixed mb-4">
                            <Container>
                                <div className="row">
                                    <div className="col-8 p-4">
                                        <Form inline>
                                            <Row>
                                                <Col xs="6">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Search"
                                                        className=" mr-sm-2"
                                                    />
                                                </Col>
                                                <Col xs="auto">
                                                    <Button type="submit">
                                                        Submit
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                    <div className="col-4 align-content-center">
                                        <div className="d-flex justify-content-center">
                                            <div>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                >
                                                    <StyledBadge
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right",
                                                        }}
                                                        variant="dot"
                                                    >
                                                        <Avatar
                                                            alt="Remy Sharp"
                                                            src="/static/images/avatar/1.jpg"
                                                        />
                                                    </StyledBadge>
                                                </Stack>
                                            </div>
                                            <div className="d-flex justify-content-center align-content-center">
                                                <p className="p-0 mt-2">Nguyễn Văn Hoàng</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </div>
                    <div>{children}</div>
                </main>
            </div>
        </>
    );
}

export default Layout;
