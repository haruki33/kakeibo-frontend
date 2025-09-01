import { useState } from "react";
import "./MyDrawer.css";
import { Box, VStack, Heading, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function MyDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menu = [
    {
      title: "管理",
      children: [{ label: "カテゴリー", path: "/MySetting" }],
    },
  ];

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
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
        <VStack pt="24" pl="20" align="flex-start" gap="8">
          {menu.map((item, index) => (
            <Box key={index}>
              <Heading size="md">{item.title}</Heading>
              {item.children && (
                <VStack pt="1">
                  {item.children.map((child, idx) => (
                    <Link key={idx} onClick={() => handleNavigate(child.path)}>
                      {child.label}
                    </Link>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      </div>

      {isOpen && <div className="drawer-overlay" onClick={handleClick}></div>}
    </>
  );
}
