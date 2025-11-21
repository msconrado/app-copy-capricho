/**
 * Daily Tips Email Job
 * Run this job every day at a specific time (e.g., 8 AM)
 * 
 * Usage: node send-daily-tips.mjs
 * 
 * For production, schedule with cron:
 * 0 8 * * * cd /path/to/project && node server/jobs/send-daily-tips.mjs
 */

import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split("@")[1]?.split(":")[0] || "localhost",
  user: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "root",
  password: process.env.DATABASE_URL?.split(":")[2]?.split("@")[0] || "",
  database: process.env.DATABASE_URL?.split("/").pop() || "sera_que_ele_gosta",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendDailyTips() {
  console.log("[Daily Tips] Starting email job...");

  try {
    const connection = await pool.getConnection();

    // Get all active subscriptions
    const [subscriptions] = await connection.query(
      `SELECT s.*, u.email, u.name 
       FROM subscriptions s 
       JOIN users u ON s.userId = u.id 
       WHERE s.status = 'active'`
    );

    console.log(`[Daily Tips] Found ${subscriptions.length} active subscriptions`);

    for (const sub of subscriptions) {
      try {
        // Calculate day number
        const dayNumber = Math.floor(
          (Date.now() - new Date(sub.currentPeriodStart).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

        const cappedDay = Math.min(dayNumber, 30);

        // Get today's tip
        const [tips] = await connection.query(
          `SELECT * FROM daily_tips 
           WHERE subscriptionId = ? AND dayNumber = ? AND sentAt IS NULL`,
          [sub.id, cappedDay]
        );

        if (tips.length === 0) {
          console.log(`[Daily Tips] No unsent tip for subscription ${sub.id}`);
          continue;
        }

        const tip = tips[0];

        // Send email
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF6B9F 0%, #C8A2FF 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .section { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #FF6B9F; border-radius: 4px; }
                .action { background: #FFF0F5; border-left-color: #FF6B9F; }
                .reflection { background: #F0F4FF; border-left-color: #A5D8FF; }
                .motivation { background: #FFFACD; border-left-color: #FFD700; }
                .button { display: inline-block; background: linear-gradient(135deg, #FF6B9F 0%, #C8A2FF 100%); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 10px; }
                .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💜 Conselheiro Amoroso</h1>
                  <p>Dia ${cappedDay} de 30 - Sua Dica do Dia</p>
                </div>

                <div class="content">
                  <h2>${tip.title}</h2>
                  <p>${tip.content}</p>

                  <div class="section action">
                    <strong>✨ Ação do Dia:</strong>
                    <p>${tip.actionOfDay}</p>
                  </div>

                  <div class="section reflection">
                    <strong>💭 Reflexão:</strong>
                    <p>${tip.reflection}</p>
                  </div>

                  <div class="section motivation">
                    <strong>🌟 Motivação:</strong>
                    <p>${tip.motivation}</p>
                  </div>

                  <center>
                    <a href="${process.env.VITE_APP_URL || "https://sera-que-ele-gosta.manus.space"}/advisor" class="button">Ver meu Dashboard</a>
                  </center>
                </div>

                <div class="footer">
                  <p>Você está no caminho certo! Continue assim! 💕</p>
                  <p>© 2025 Será que Ele(a) Gosta de Mim? - Todos os direitos reservados</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || "noreply@sera-que-ele-gosta.com",
          to: sub.email,
          subject: `💜 Dia ${cappedDay}: ${tip.title}`,
          html: emailHtml,
        });

        console.log(`[Daily Tips] Email sent to ${sub.email} (Day ${cappedDay})`);

        // Mark as sent
        await connection.query(`UPDATE daily_tips SET sentAt = NOW() WHERE id = ?`, [tip.id]);
      } catch (error) {
        console.error(`[Daily Tips] Error processing subscription ${sub.id}:`, error);
      }
    }

    connection.release();
    console.log("[Daily Tips] Job completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("[Daily Tips] Fatal error:", error);
    process.exit(1);
  }
}

// Run the job
sendDailyTips();
