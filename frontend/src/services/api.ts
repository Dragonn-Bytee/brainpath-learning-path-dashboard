export interface DashboardStats {
    enrolled: number;
    completed: number;
    quizzes: number;
}

export interface WeeklyActivity {
    day: string;
    hours: number;
}

export interface EnrolledCourse {
    id: string;
    title: string;
    progress: number;
    lastLesson: string;
}

export interface Lesson {
    _id: string;
    title: string;
    duration: number;
    videoUrl?: string;
    order: number;
}

export interface QuizQuestion {
    _id?: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface Course {
    id: string;
    _id?: string;
    title: string;
    category: string;
    description: string;
    image: string;
    thumbnail?: string;
    lessons?: Lesson[];
    instructor?: string;
    documentation?: string;
    difficulty?: string;
    quiz?: QuizQuestion[];
}

export interface EnrollmentData {
    _id: string;
    progress: number;
    completedLessons: string[];
    courseId: Course;
    quizScore?: number;
    quizPassed?: boolean;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    occupation?: string;
    avatar?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user._id;
    } catch {
        return null;
    }
};

export const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || data.msg || 'Login failed');
    return data;
};

export const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || data.msg || 'Registration failed');
    return data;
};

export const googleLogin = async (
    name?: string,
    email?: string,
    avatar?: string,
    googleId?: string,
    credential?: string
) => {
    const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatar, googleId, credential })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || data.msg || 'Google Sign-in failed');
    return data;
};

export const fetchDashboardData = async () => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/dashboard/${userId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const data = await fetchDashboardData();
        return {
            enrolled: data.coursesEnrolled,
            completed: data.coursesCompleted,
            quizzes: data.quizzesTaken,
        };
    } catch (err) {
        throw err;
    }
};

export const fetchWeeklyActivity = async (): Promise<WeeklyActivity[]> => {
    try {
        const data = await fetchDashboardData();
        return data.weeklyLearningActivity;
    } catch (err) {
        throw err;
    }
};

export const fetchMyCourses = async (): Promise<EnrolledCourse[]> => {
    try {
        const data = await fetchDashboardData();
        return data.enrolledCourses;
    } catch (err) {
        throw err;
    }
};

export const fetchMarketplaceCourses = async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    const courses = await res.json();
    return courses.map((c: any) => ({
        ...c,
        id: c._id,
        image: c.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80'
    }));
};

export const enrollInCourse = async (courseId: string) => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/enroll`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, courseId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || data.msg || 'Enrollment failed');
    return data;
};

export const updateProgress = async (courseId: string, lessonId: string) => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, courseId, lessonId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || data.msg || 'Progress update failed');
    return data;
};

export const fetchEnrollment = async (courseId: string): Promise<EnrollmentData> => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/enroll/${userId}/${courseId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch enrollment data');
    return res.json();
};

export const fetchProfile = async (): Promise<User> => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/profile/${userId}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
};

export const updateProfile = async (data: { name?: string; occupation?: string; avatar?: string }): Promise<User> => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/profile/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
};

export const submitQuiz = async (courseId: string, score: number): Promise<{ quizPassed: boolean; progress: number }> => {
    const userId = getUserId();
    if (!userId) throw new Error('Not logged in');
    const res = await fetch(`${API_BASE}/progress/quiz`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, courseId, score })
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
};
