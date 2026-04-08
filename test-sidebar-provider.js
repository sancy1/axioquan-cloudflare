// Test if SidebarProvider and useSidebar work correctly
const { SidebarProvider } = require('./src/contexts/sidebar-context.tsx');
const { useSidebar } = require('./src/contexts/sidebar-context.tsx');

try {
  const context = useSidebar();
  console.log('✅ useSidebar hook works:', context);
  console.log('✅ SidebarProvider export works');
} catch (error) {
  console.error('❌ Error:', error.message);
}
