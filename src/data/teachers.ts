import { Teacher, TeacherType } from '../types';

export const teachers: Record<TeacherType, Teacher> = {
  emma: {
    id: 'emma',
    name: 'Emma',
    nameZh: '艾玛',
    personality: '温柔耐心，鼓励型',
    specialty: '日常口语、发音基础',
    suitableFor: '初学者、害羞学习者',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  james: {
    id: 'james',
    name: 'James',
    nameZh: '詹姆斯',
    personality: '严谨专业，学术型',
    specialty: '商务英语、正式场合',
    suitableFor: '职场人士、考试备考',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  lily: {
    id: 'lily',
    name: 'Lily',
    nameZh: '莉莉',
    personality: '活泼开朗，轻松型',
    specialty: '日常对话、流行话题',
    suitableFor: '中级学习者、年轻群体',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  david: {
    id: 'david',
    name: 'David',
    nameZh: '大卫',
    personality: '幽默风趣，激励型',
    specialty: '自信表达、口音矫正',
    suitableFor: '进阶学习者',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
};

export const getTeacher = (id: TeacherType): Teacher => teachers[id];

export const defaultTeachers: TeacherType[] = ['emma', 'james', 'lily', 'david'];
