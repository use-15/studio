
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  UserCircle,
  Bell,
  CreditCard,
  Eye,
  ChevronLeft,
  ChevronRight,
  Info,
  BriefcaseMedical,
  Stethoscope,
  Pill,
  PlusCircle,
  ListChecks, // Added for To-Do List
  Trash2 // Added for To-Do List
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, getDate } from 'date-fns';
import Image from 'next/image';

const healthChartData = [
  { name: '2016', myData: 65, average: 60 },
  { name: '2017', myData: 70, average: 62 },
  { name: '2018', myData: 60, average: 68 },
  { name: '2019', myData: 75, average: 70 },
  { name: '2020', myData: 80, average: 75 },
  { name: '2021', myData: 78, average: 72 },
];

const userProfile = {
  name: 'Boss Willis',
  ageLocation: '24 years, California',
  avatarUrl: 'https://placehold.co/80x80/E5F5E0/228B22.png?text=BW',
  bloodType: '-B',
  height: '170 cm',
  weight: '60 kg',
};

const notifications = [
  {
    id: 'notif1',
    type: 'medication',
    title: 'Kognum',
    details: '10mg',
    schedule: 'MON WED FRI SUN - 2 times a day before food',
    icon: <Pill className="h-5 w-5 text-blue-500" />,
    date: '20 Aug 2019',
  },
  {
    id: 'notif2',
    type: 'appointment',
    title: 'Surgeon - Dr. Isabella Bowers',
    details: 'California Medical Center',
    specialty: 'Spinal pain',
    date: '26 Aug 2019',
    time: '12:45 AM',
    avatarUrl: 'https://placehold.co/40x40/E5F5E0/228B22.png?text=IB',
    icon: <Stethoscope className="h-5 w-5 text-green-500" />,
  },
];

const examinations = [
  {
    id: 'exam1',
    date: '21 Jul, 2019',
    title: 'Hypertensive crisis',
    status: 'Ongoing treatment',
    statusColor: 'blue',
  },
  {
    id: 'exam2',
    date: '18 Jul, 2019',
    title: 'Osteoporosis',
    status: 'Incurable',
    statusColor: 'red',
    tag: 'Need attention'
  },
  {
    id: 'exam3',
    date: '21 Jun, 2019',
    title: 'General Checkup',
    status: 'Examination',
    statusColor: 'green',
  },
];

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // Store as ISO string for localStorage
}

const LOCAL_STORAGE_KEY_TODOS = 'armiyot_dashboard_todos';

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [chartTimeRange, setChartTimeRange] = useState<'D' | 'W' | 'M' | 'Y'>('Y');

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY_TODOS);
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Failed to load todos from localStorage:", error);
      }
    }
  }, []);

  // Save todos to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_TODOS, JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos to localStorage:", error);
      }
    }
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };


  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = getDay(startOfMonth(currentMonth)); 
  const emptyStartCells = Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth -1).fill(null);


  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderUserProfile = () => (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-6 text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-primary">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="user avatar"/>
          <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold font-headline">{userProfile.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{userProfile.ageLocation}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Blood</p>
            <p className="font-semibold">{userProfile.bloodType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Height</p>
            <p className="font-semibold">{userProfile.height}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="font-semibold">{userProfile.weight}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-headline">Notifications</CardTitle>
          <p className="text-xs text-muted-foreground">{notifications.length > 0 ? notifications[0].date : ''}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-start space-x-3">
            {notif.type === 'medication' && notif.icon ? (
              <div className="p-2 bg-blue-100 rounded-full">{notif.icon}</div>
            ) : notif.type === 'appointment' && notif.avatarUrl ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={notif.avatarUrl} alt={notif.title} data-ai-hint="doctor avatar"/>
                <AvatarFallback>{notif.title.split(' ').map(n=>n[0]).slice(0,2).join('')}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="p-2 bg-gray-100 rounded-full"><Bell className="h-5 w-5 text-gray-500"/></div>
            )}
            <div>
              <p className="font-semibold text-sm">{notif.title} {notif.type === 'medication' ? <span className="text-xs text-muted-foreground">{notif.details}</span> : ''}</p>
              {notif.type === 'appointment' && <p className="text-xs text-muted-foreground">{notif.specialty} - {notif.details}</p>}
              {notif.schedule && <p className="text-xs text-muted-foreground">{notif.schedule}</p>}
              {notif.time && <p className="text-xs text-muted-foreground">Date: {notif.date}, Time: {notif.time}</p>}
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-sm text-muted-foreground">No new notifications.</p>}
      </CardContent>
    </Card>
  );

  const renderPaymentCard = () => (
     <Card className="shadow-lg rounded-xl bg-gradient-to-br from-accent/80 via-accent to-accent/70 text-accent-foreground p-5">
        <div className="flex justify-between items-center mb-4">
            <p className="text-sm">Boss Willis</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24"><path fill="#fff" d="M30.275 6.616h-24.4a1.54 1.54 0 00-1.54 1.54v7.7a1.54 1.54 0 001.54 1.54h24.4a1.54 1.54 0 001.54-1.54v-7.7a1.54 1.54 0 00-1.54-1.54zm-20.054 7.954h-2.76v-1.664h2.76zm3.092 0h-2.76V9.466h.003l2.757.002zm3.091 0h-2.76v-4.89h2.76zm12.144-5.99H14.17v6.25h14.382V8.58zm-3.092 4.335H24.7v-2.61h2.76v2.61z"/></svg>
        </div>
        <p className="text-lg font-mono tracking-wider mb-4">2345 4845 7885 5432</p>
        <div className="flex justify-end">
            <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-accent-foreground p-2 h-auto rounded-md">
                <PlusCircle className="h-5 w-5 mr-1" /> Add Card
            </Button>
        </div>
    </Card>
  );
  
  const renderTodoList = () => (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-headline flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" /> To-Do List
          </CardTitle>
          <Badge variant={todos.filter(t => !t.completed).length > 0 ? "destructive" : "default"}>
            {todos.filter(t => !t.completed).length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </form>
        <ScrollArea className="h-[200px] pr-3">
          {todos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add some!</p>
          )}
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  aria-label={todo.text}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-grow text-sm cursor-pointer ${
                    todo.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {todo.text}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteTodo(todo.id)}
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );


  const renderExaminations = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold font-headline text-primary">Examinations</h2>
        <Button variant="link" className="text-primary hover:text-primary/80">
          See All <Eye className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examinations.map((exam) => {
          let borderColorClass = 'border-muted';
          if (exam.statusColor === 'blue') borderColorClass = 'border-blue-500';
          else if (exam.statusColor === 'red') borderColorClass = 'border-red-500';
          else if (exam.statusColor === 'green') borderColorClass = 'border-green-500';

          return (
            <Card key={exam.id} className={`shadow-md rounded-lg border-l-4 ${borderColorClass}`}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{exam.date}</p>
                <h3 className="font-semibold mt-1 mb-1">{exam.title}</h3>
                <p className="text-sm text-muted-foreground">{exam.status}</p>
                {exam.tag && <Badge variant="outline" className="mt-2 border-orange-500 text-orange-600">{exam.tag}</Badge>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
  
  const renderHealthCurve = () => (
    <Card className="shadow-lg rounded-xl mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-headline">Health Curve</CardTitle>
          <div className="flex space-x-1">
            {(['D', 'W', 'M', 'Y'] as const).map((range) => (
              <Button
                key={range}
                variant={chartTimeRange === range ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setChartTimeRange(range)}
                className="px-2 py-1 h-auto text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="myData" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} name="My Data" />
              <Line type="monotone" dataKey="average" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--chart-2))' }} name="Average" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderNearestTreatment = () => (
    <Card className="shadow-lg rounded-xl mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline">Nearest Treatment</CardTitle>
            <Button variant="link" size="sm" className="text-primary">
                {format(currentMonth, 'MMMM yyyy')} <ChevronRight className="ml-1 h-4 w-4"/>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <p className="text-sm font-semibold">{format(currentMonth, 'MMMM yyyy')}</p>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyStartCells.map((_, index) => (
            <div key={`empty-${index}`} className="p-1.5 rounded-md"></div>
          ))}
          {daysInMonth.map((day) => (
            <Button
              key={day.toString()}
              variant={isToday(day) ? 'secondary' : 'ghost'}
              size="icon"
              className={`h-8 w-8 p-0 text-xs font-normal rounded-md ${isToday(day) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent hover:text-accent-foreground'}`}
            >
              {getDate(day)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderAdvice = () => (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <Info className="mr-2 h-5 w-5 text-primary" /> Advice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          The clinical service is consultative and available on a 24-hour basis. Further medical advice can be obtained...
        </p>
        <Button variant="link" asChild className="p-0 h-auto text-sm text-primary hover:text-primary/80">
          <a href="#" target="_blank" rel="noopener noreferrer">More info via the Clinical Advice link</a>
        </Button>
      </CardContent>
    </Card>
  );


  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Health Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your personal overview of health metrics, notifications, and advice.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {renderUserProfile()}
            {renderNotifications()}
            {renderPaymentCard()}
            {renderTodoList()}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {renderExaminations()}
            {renderHealthCurve()}
            {renderNearestTreatment()}
            {renderAdvice()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

