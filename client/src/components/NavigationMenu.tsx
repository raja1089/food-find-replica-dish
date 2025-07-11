import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown, Users, FileText, Building2 } from "lucide-react";

const DynamicNavigationMenu = () => {
  const { data: footerPages = [] } = useQuery({
    queryKey: ["/api/footer-pages"],
  });

  // Group footer pages by category
  const groupedPages = footerPages.reduce((acc: any, page: any) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {});

  // Sort pages within each category by order
  Object.keys(groupedPages).forEach(category => {
    groupedPages[category].sort((a: any, b: any) => a.order - b.order);
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Building2 className="w-4 h-4 mr-2" />
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {groupedPages["Company"]?.map((page: any) => (
                <li key={page.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/page/${page.slug}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{page.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Learn more about {page.title.toLowerCase()}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Careers</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Join our team and make a difference
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FileText className="w-4 h-4 mr-2" />
            Legal
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {groupedPages["Legal"]?.map((page: any) => (
                <li key={page.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/page/${page.slug}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{page.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Read our {page.title.toLowerCase()}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DynamicNavigationMenu;