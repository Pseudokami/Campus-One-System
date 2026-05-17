import { Injectable } from '@nestjs/common';
import { supabase } from '../../libs/database/supabase';

const SEMESTER_MAP: Record<string, string> = {
  'First Term':  '1st Semester',
  'Second Term': '2nd Semester',
  'Summer Term': 'Summer',
};

@Injectable()
export class SubjectsService {
  async getSubjects(schoolYear?: string, term?: string) {
    let query = supabase
      .from('subjects')
      .select('id, code, name, description, units, semester, school_year, is_active')
      .eq('is_active', true);

    if (schoolYear) query = query.eq('school_year', schoolYear);
    if (term) {
      const mapped = SEMESTER_MAP[term] ?? term;
      query = query.eq('semester', mapped);
    }

    const { data, error } = await query.order('code');
    if (error) throw new Error(error.message);

    return (data ?? []).map((s: any) => ({
      id: s.id,
      subjectCode: s.code,
      subjectTitle: s.name,
      description: s.description,
      units: s.units,
      semester: s.semester,
      schoolYear: s.school_year,
    }));
  }

  async getUserInfo(userId: string) {
    const { data: ap } = await supabase
      .from('applicant_profiles').select('first_name, last_name').eq('id', userId).maybeSingle();
    return { userName: ap ? `${ap.first_name} ${ap.last_name}` : '' };
  }
}
