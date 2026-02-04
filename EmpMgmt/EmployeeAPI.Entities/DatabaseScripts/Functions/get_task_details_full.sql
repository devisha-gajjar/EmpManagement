CREATE OR REPLACE FUNCTION get_task_detail_full(p_task_id INT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Validate task existence
    IF NOT EXISTS (
        SELECT 1
        FROM user_task ut
        WHERE ut.task_id = p_task_id
    ) THEN
        RAISE EXCEPTION 'Task not found'
            USING ERRCODE = 'P0001';
    END IF;

    SELECT jsonb_build_object(

        /* =========================
           Task Header
        ========================= */
        'task', jsonb_build_object(
            'taskId', ut.task_id,
            'taskName', ut.task_name,
            'description', ut.description,
            'status', ut.status,
            'priority', ut.priority,
            'startDate', to_char(ut.start_date, 'YYYY-MM-DD"T"HH24:MI:SS'),
			'dueDate', to_char(ut.due_date, 'YYYY-MM-DD"T"HH24:MI:SS'),
			'completedOn', to_char(ut.completed_on, 'YYYY-MM-DD"T"HH24:MI:SS'),
            'projectId', ut.project_id,
            'assignedTo', ut.user_id,
            'assignedBy', ut.assigned_by,
            'estimatedHours', ut.estimated_hours,
            'spentHours', COALESCE(wh.total_hours, 0)
        ),

        /* =========================
           Stats
        ========================= */
        'stats', jsonb_build_object(
            'estimatedHours', ut.estimated_hours,
            'totalLoggedHours', COALESCE(wh.total_hours, 0)
        ),

        /* =========================
           Tags
        ========================= */
        'tags', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'tagId', tt.tag_id,
                    'name', tt.name
                )
            )
            FROM task_tag_map ttm
            JOIN task_tags tt ON tt.tag_id = ttm.tag_id
            WHERE ttm.task_id = ut.task_id
        ), '[]'::jsonb),

        /* =========================
           Timeline
        ========================= */
       'timeline', COALESCE((
		    SELECT jsonb_agg(
		        jsonb_build_object(
		            'activityId', tal.activity_id,
		            'action', tal.action,
		            'oldValue', tal.old_value,
		            'newValue', tal.new_value,
		            'userId', tal.user_id,
		            'userName', CONCAT(u.first_name, ' ', u.last_name),
		            'createdOn', to_char(
		                tal.created_on,
		                'YYYY-MM-DD"T"HH24:MI:SS'
		            )
		        )
		        ORDER BY tal.created_on DESC
		    )
		    FROM task_activity_log tal
		    LEFT JOIN users u ON u.user_id = tal.user_id
		    WHERE tal.task_id = ut.task_id
		), '[]'::jsonb),

        /* =========================
           Work Logs
        ========================= */
      	 'workLogs', COALESCE((
		    SELECT jsonb_agg(
		        jsonb_build_object(
		            'workLogId', wl.work_log_id,
		            'userId', wl.user_id,
		            'userName', CONCAT(u.first_name, ' ', u.last_name),
		            'hoursSpent', wl.hours_spent,
		            'logDate', to_char(wl.log_date, 'YYYY-MM-DD'),
		            'description', wl.description,
		            'createdOn', to_char(
		                wl.created_on,
		                'YYYY-MM-DD"T"HH24:MI:SS'
		            )
		        )
		        ORDER BY wl.log_date DESC
		    )
		    FROM task_work_logs wl
		    LEFT JOIN users u ON u.user_id = wl.user_id
		    WHERE wl.task_id = ut.task_id
		), '[]'::jsonb),

        /* =========================
           Comments
        ========================= */
        'comments', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'commentId', tc.comment_id,
                    'createdBy', tc.created_by,
                    'comment', tc.comment,
                    'createdOn', tc.created_on
                )
                ORDER BY tc.created_on DESC
            )
            FROM task_comments tc
            WHERE tc.task_id = ut.task_id
        ), '[]'::jsonb),

        /* =========================
           Attachments
        ========================= */
        'attachments', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'attachmentId', ta.attachment_id,
                    'fileUrl', ta.file_url,
                    'uploadedBy', ta.uploaded_by,
                    'uploadedOn', ta.uploaded_on
                )
            )
            FROM task_attachments ta
            WHERE ta.task_id = ut.task_id
        ), '[]'::jsonb)

    )
    INTO result
    FROM user_task ut
    LEFT JOIN (
        SELECT task_id, SUM(hours_spent) AS total_hours
        FROM task_work_logs
        GROUP BY task_id
    ) wh ON wh.task_id = ut.task_id
    WHERE ut.task_id = p_task_id;

    RETURN result;
END;
$$;


SELECT get_task_detail_full(1);
