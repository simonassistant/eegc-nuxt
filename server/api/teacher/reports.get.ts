import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Basic Auth Check
    const token = getCookie(event, 'teacher_auth')
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Teacher login required',
        })
    }

    try {
        jwt.verify(token, config.jwtSecret)
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired token',
        })
    }

    const supabase = createClient(config.supabaseUrl, config.supabaseKey)

    const { data, error } = await supabase
        .from('learning_reports')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Supabase Error fetching reports:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }

    return {
        success: true,
        reports: data
    }
})
