import { Injectable } from '@nestjs/common';
import { supabase } from './database/supabase';

@Injectable()
export class DashboardService {
  async getDashboard(userId: string) {
    const { data: ap } = await supabase
      .from('applicant_profiles').select('first_name, last_name').eq('id', userId).maybeSingle();
    const name = ap ? `${ap.first_name} ${ap.last_name}` : '';

    const { data: studentAccount } = await supabase
      .from('student_accounts').select('id, student_number').eq('applicant_id', userId).maybeSingle();

    let enrolledCourses = 0, enrolledUnits = 0;
    if (studentAccount) {
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_assignments!inner(subjects!inner(units))')
        .eq('student_id', studentAccount.id)
        .eq('enrollment_status', 'enrolled');
      if (enrollments?.length) {
        enrolledCourses = enrollments.length;
        enrolledUnits = enrollments.reduce((sum: number, e: any) =>
          sum + (e.class_assignments?.subjects?.units ?? 0), 0);
      }
    }

    return { name, studentNumber: studentAccount?.student_number ?? null, enrolledCourses, enrolledUnits, cartSubjects: 0, cartUnits: 0 };
  }
}
