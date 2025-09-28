import { useState } from "react";
import "./MyDrawer.css";
import { Box, VStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router";
import { useAuth } from "../../utils/useAuth";

export default function MyDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { onLogout } = useAuth();

  const menu = [
    {
      title: "管理",
      children: [{ label: "カテゴリー", path: "/MySetting" }],
    },
  ];

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="drawer-btn-wrapper">
        <button
          onClick={handleClick}
          className={`drawer-toggle ${isOpen ? "open" : ""}`}
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          <span className="icon"></span>
        </button>
      </div>

      <div className={`drawer-nav ${isOpen ? "is-open" : ""}`}>
        <VStack pt="24" pl="16" align="flex-start" gap="8">
          {menu.map((item, index) => (
            <Box key={index}>
              <Heading size={{ base: "lg", md: "xl" }}>{item.title}</Heading>
              {item.children && (
                <VStack pt="1">
                  {item.children.map((child, idx) => (
                    <Link
                      key={idx}
                      to={child.path}
                      onClick={() => setIsOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
          <Box pb="8">
            <Link to="/" onClick={onLogout}>
              <Heading size={{ base: "lg", md: "xl" }}>ログアウト</Heading>
            </Link>
          </Box>
        </VStack>
      </div>

      {isOpen && <div className="drawer-overlay" onClick={handleClick}></div>}
    </>
  );
}
