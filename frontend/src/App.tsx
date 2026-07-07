import { useState } from 'react';
import {
  Button,
  Input,
  PasswordInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Divider,
  Spinner,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Avatar,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Pagination,
  Tooltip,
  Modal,
  SearchBar,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle,
} from './components';

export default function App() {
  // Form playground states
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState('');
  const [password, setPassword] = useState('');
  const [textareaText, setTextareaText] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [radioVal, setRadioVal] = useState('one');
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);

  // Button loading states
  const [btnLoading, setBtnLoading] = useState(false);

  // Advanced components states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  const handleValidateInput = (val: string) => {
    setInputText(val);
    if (val.length > 0 && val.length < 5) {
      setInputError('Input must be at least 5 characters long.');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-slate-950 transition-colors duration-theme-normal flex flex-col">
      {/* Premium Header Banners */}
      <header className="sticky top-0 z-layer-sticky w-full bg-neutral-surface dark:bg-slate-900 border-b border-neutral-borderLine dark:border-slate-800 shadow-shadow-small px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-radius-md bg-brand-primary flex items-center justify-center text-neutral-surface font-bold text-lg shadow-shadow-small">
            CC
          </div>
          <div>
            <h1 className="text-h4 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              Commute Connect Design Playground
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-radius-pill text-tiny font-medium bg-blue-50 text-brand-primary dark:bg-blue-900/30 dark:text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                Step 3: Advanced UI
              </span>
            </h1>
            <p className="text-tiny text-neutral-textSub dark:text-slate-400">
              Live component document repository and visual QA testing canvas.
            </p>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation Documentation Index */}
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-neutral-surface dark:bg-slate-900 rounded-radius-lg p-5 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small">
            <h2 className="text-small font-bold uppercase tracking-wider text-neutral-textSub dark:text-slate-400 mb-3">
              Design System Index
            </h2>
            <nav className="space-y-1">
              <a href="#buttons" className="block text-small font-medium text-brand-primary hover:underline py-1.5 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" /> Buttons
              </a>
              <a href="#inputs" className="block text-small font-medium text-brand-primary hover:underline py-1.5 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" /> Text Inputs
              </a>
              <a href="#toggles" className="block text-small font-medium text-brand-primary hover:underline py-1.5 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" /> Checkbox, Radio, Switch
              </a>
              <a href="#advanced" className="block text-small font-medium text-brand-primary hover:underline py-1.5 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" /> Advanced UI
              </a>
              <a href="#loaders" className="block text-small font-medium text-brand-primary hover:underline py-1.5 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" /> Dividers & Spinners
              </a>
            </nav>
            
            <Divider className="my-4" />
            
            <h3 className="text-tiny font-semibold text-neutral-textMain dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-primary" /> Accessibility Check
            </h3>
            <p className="text-[12px] text-neutral-textSub dark:text-slate-400 leading-relaxed">
              Every interactive element supports keyboard tab index selection, visible outlines, and screen reader labels. Try using <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 rounded text-[11px] font-mono shadow-sm">Tab</kbd> to navigate this page.
            </p>
          </div>
        </aside>

        {/* Component Showcase Panel Canvas */}
        <section className="md:col-span-3 space-y-8">
          
          {/* Section: Buttons */}
          <div id="buttons" className="bg-neutral-surface dark:bg-slate-900 rounded-radius-lg p-6 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small space-y-6">
            <div>
              <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">Button Component</h2>
              <p className="text-small text-neutral-textSub dark:text-slate-400 mt-1">
                Trigger actions via custom sizes, semantic variants, left/right icon mappings, and loading indicators.
              </p>
            </div>
            
            <Divider />

            {/* Sub-section: Variants */}
            <div className="space-y-3">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Semantic Design Variants</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            {/* Sub-section: Sizes */}
            <div className="space-y-3">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Sizes</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" size="sm">Small (sm)</Button>
                <Button variant="primary" size="md">Medium (md)</Button>
                <Button variant="primary" size="lg">Large (lg)</Button>
              </div>
            </div>

            {/* Sub-section: Loading & Icons */}
            <div className="space-y-3">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Interactive States & Icons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" loading={btnLoading} onClick={triggerLoading}>
                  {btnLoading ? 'Loading...' : 'Click to Load'}
                </Button>
                <Button variant="secondary" disabled>Disabled State</Button>
                <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />}>
                  Left Icon
                </Button>
                <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Right Icon
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Text Inputs */}
          <div id="inputs" className="bg-neutral-surface dark:bg-slate-900 rounded-radius-lg p-6 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small space-y-6">
            <div>
              <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">Form Input Controls</h2>
              <p className="text-small text-neutral-textSub dark:text-slate-400 mt-1">
                Data capturing elements with labeling, validation constraints, secure password masks, and custom heights.
              </p>
            </div>
            
            <Divider />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Standard Text Input"
                placeholder="Enter some text..."
                value={inputText}
                onChange={(e) => handleValidateInput(e.target.value)}
                helperText="Character counter validation active (min 5 chars)."
                error={inputError}
              />

              <PasswordInput
                label="Password Input (Toggle Mask)"
                placeholder="Enter your security password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Click the eye icon to review key mask."
              />

              <Select
                label="Dropdown Option Picker"
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
                helperText="Native dropdown overlays ensure tactile touchscreen focus."
              >
                <option value="">Choose an option...</option>
                <option value="stu">Student Commuter</option>
                <option value="emp">Office Employee</option>
                <option value="oth">Other / Guest</option>
              </Select>

              <Textarea
                label="Multiline Textarea"
                placeholder="Write a brief profile description..."
                value={textareaText}
                onChange={(e) => setTextareaText(e.target.value)}
                rows={3}
              />
            </div>

            <div className="p-4 rounded-radius-md bg-slate-50 dark:bg-slate-800 border border-neutral-borderLine dark:border-slate-700 space-y-3">
              <h3 className="text-tiny font-bold uppercase tracking-wider text-neutral-textSub dark:text-slate-400">
                Disabled & Loading Inputs Showcase
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Disabled Input" value="Cannot edit this" disabled />
                <Input label="Loading Spinner Input" placeholder="Fetching query..." loading />
              </div>
            </div>
          </div>

          {/* Section: Toggles */}
          <div id="toggles" className="bg-neutral-surface dark:bg-slate-900 rounded-radius-lg p-6 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small space-y-6">
            <div>
              <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">Checkboxes, Radios & Switches</h2>
              <p className="text-small text-neutral-textSub dark:text-slate-400 mt-1">
                Tactile state toggle controls featuring custom checks, radio grouping selections, and translation switches.
              </p>
            </div>
            
            <Divider />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Checkboxes */}
              <div className="space-y-2">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300 mb-2">Checkboxes</h3>
                <Checkbox
                  label="Unchecked Box"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                />
                <Checkbox
                  label="Checked Box"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                />
                <Checkbox
                  label="Disabled Check"
                  disabled
                  checked={true}
                />
              </div>

              {/* Radios */}
              <div className="space-y-2">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300 mb-2">Radio Group Selection</h3>
                <Radio
                  name="demo-radio"
                  label="Option One"
                  value="one"
                  checked={radioVal === 'one'}
                  onChange={(e) => setRadioVal(e.target.value)}
                />
                <Radio
                  name="demo-radio"
                  label="Option Two"
                  value="two"
                  checked={radioVal === 'two'}
                  onChange={(e) => setRadioVal(e.target.value)}
                />
                <Radio
                  name="demo-radio"
                  label="Disabled Option"
                  disabled
                  checked={false}
                />
              </div>

              {/* Switches */}
              <div className="space-y-2">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300 mb-2">Toggle Switches</h3>
                <Switch
                  label="Notifications"
                  checked={switch1}
                  onChange={(e) => setSwitch1(e.target.checked)}
                />
                <Switch
                  label="Location Active"
                  checked={switch2}
                  onChange={(e) => setSwitch2(e.target.checked)}
                />
                <Switch
                  label="Disabled Toggle"
                  disabled
                  checked={false}
                />
              </div>
            </div>
          </div>

          {/* Section: Advanced UI */}
          <div id="advanced" className="bg-neutral-surface dark:bg-slate-900 rounded-radius-lg p-6 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small space-y-6">
            <div>
              <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">Advanced Composable UI Components</h2>
              <p className="text-small text-neutral-textSub dark:text-slate-400 mt-1">
                Compound Cards, Avatar fallbacks, Badge labels, responsive Tables, Tabs switcher layouts, Tooltips, and Modals.
              </p>
            </div>
            
            <Divider />

            {/* Sub-section: Badges & Avatars & SearchBar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Badges & Avatars</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Avatar fallback="JD" size="sm" alt="John Doe" />
                  <Avatar fallback="JD" size="md" alt="John Doe" />
                  <Avatar fallback="JD" size="lg" alt="John Doe" />
                  <Tooltip content="Hovering triggers a description tooltip box!" position="right">
                    <span className="text-small text-brand-primary underline cursor-help">Hover over me</span>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Search Bar & Modal Triggers</h3>
                <SearchBar
                  placeholder="Type search queries here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                />
                <div className="pt-2">
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Trigger Interactive Modal
                  </Button>
                </div>
              </div>
            </div>

            {/* Sub-section: Tabs */}
            <div className="space-y-3">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Tabs Compound Layout</h3>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details Panel</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-radius-md border border-neutral-borderLine dark:border-slate-700">
                  <p className="text-small text-neutral-textMain dark:text-slate-300">
                    This is the Overview tab panel. Nested composability manages focus states.
                  </p>
                </TabsContent>
                <TabsContent value="details" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-radius-md border border-neutral-borderLine dark:border-slate-700">
                  <p className="text-small text-neutral-textMain dark:text-slate-300">
                    This is the Details tab panel. Switch states have zero local react-state wiring.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sub-section: Composable Card */}
            <div className="space-y-3">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Composable Card</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Design System Compound Card</CardTitle>
                  <CardDescription>
                    Composable architectures allow nesting elements like headers, descriptions, footers, and content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-small text-neutral-textMain dark:text-slate-300">
                    This is card body content rendered within a CardContent wrapper, which implements normalized padding.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary">Confirm Action</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sub-section: Tables & Pagination */}
            <div className="space-y-3">
              <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Responsive Composable Tables & Pagination</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Route Status</TableHead>
                    <TableHead className="text-right">Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Rahul Sharma</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">Paid (₹50)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Anya Gupta</TableCell>
                    <TableCell>Passenger</TableCell>
                    <TableCell>
                      <Badge variant="primary">Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">Free</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          </div>

          {/* Section: Loaders */}
          <div id="loaders" className="bg-neutral-surface dark:bg-slate-900 rounded-radius-lg p-6 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-small space-y-6">
            <div>
              <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">Dividers & Spinners</h2>
              <p className="text-small text-neutral-textSub dark:text-slate-400 mt-1">
                Visual separation rules and circular progress spin indicators for async interfaces.
              </p>
            </div>
            
            <Divider />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Spinner sizes */}
              <div className="space-y-3">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Spinner Sizes</h3>
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <Spinner size="sm" />
                    <span className="text-[10px] text-neutral-textSub">Small</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Spinner size="md" />
                    <span className="text-[10px] text-neutral-textSub">Medium</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Spinner size="lg" />
                    <span className="text-[10px] text-neutral-textSub">Large</span>
                  </div>
                </div>
              </div>

              {/* Divider types */}
              <div className="space-y-3">
                <h3 className="text-small font-bold text-neutral-textMain dark:text-slate-300">Divider Orientation</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-neutral-textSub block mb-1">Horizontal separator</span>
                    <Divider />
                  </div>
                  <div className="flex items-center gap-4 h-12">
                    <span className="text-[11px] text-neutral-textSub">Left Element</span>
                    <Divider orientation="vertical" />
                    <span className="text-[11px] text-neutral-textSub">Right Element</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Interactive Modal Portal Element */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Interactive Verification Dialog"
        description="Verify tab rings, focus-trapping inside dialog, and escape-key dismissal."
      >
        <p className="text-small text-neutral-textMain dark:text-slate-300 mb-6">
          This overlay modal traps your keyboard focus! Pressing Tab will only cycle through the close button and form actions inside this panel. Pressing Escape will close the window.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { alert('Proceeding!'); setIsModalOpen(false); }}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
