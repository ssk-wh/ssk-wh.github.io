---
layout: post
title:  "PAM模块-pam_script"
date:   2022-09-13
author: ssk-wh
categories: Linux
---

先确保您对pam配置已经有了基本的了解，否则应先阅读《[Linux下PAM模块学习总结](https://www.yuque.com/docs/share/5c4da2a1-02cc-4637-b4d4-e0a10e00d952?# )》
# 作用
这是一个可以在会话开始和结束时执行脚本的模块。
可以通过`sudo apt install libpam-script`安装此模块，但仍需要您手动修改pam模块的配置才能生效。
# 使用场景
在用户登录和注销时执行一些操作，比如用户 上/下线 通知.

# 描述
![](https://github.com/ssk-wh/ssk-wh.github.io/raw/master/_posts/images/pam_script/image.png)

如果/usr/share/libpam-script目录下的pam_script_auth、pam_script_acct、pam_script_passwd、pam_script_ses_open、pam_script_ses_close脚本存在的话，它会在合适的时机去调用。

```bash
root@uos-PC:/usr/share/libpam-script# ls -l
总用量 24
-rwxr-xr-x 1 root root 1366 9月  13 13:43 pam_script_acct
-rwxr-xr-x 1 root root 1355 9月  13 13:43 pam_script_auth
drwxr-xr-x 2 root root 4096 8月   9 13:36 pam-script.d
-rwxr-xr-x 1 root root 1367 9月  13 13:43 pam_script_passwd
-rwxr-xr-x 1 root root 1365 9月  13 13:44 pam_script_ses_close
-rwxr-xr-x 1 root root 1444 9月  13 15:08 pam_script_ses_open
```

您也可以通过dir=/some/path指定脚本的路径，将其作为pam模块配置的参数即可

# 认证类型和默认执行的脚本名称

| 认证类型 | 指定脚本名称 | 自动触发时机 |
| --- | --- | ---  |
| auth | pam_script_auth | username/password handshake |
| account | pam_script_acct | non-auth account management |
| passwd | pam_script_passwd | changing a password |
| session | pam_script_ses_open/pam_script_ses_close | actions performed before and after a session |


所有脚本在被pam-script模块执行时都将被传递以下几个环境变量：
PAM_USER、PAM_RUSER、PAM_RHOST、PAM_SERVICE、PAM_AUTHTOK、
PAM_OLDAUTHTOK、PAM_TTY 和 PAM_TYPE 。
（上述环境变量可能因为上下文的关系返回空值)

对pam配置文件做出以下修改，在会话开始时将会自动查找对应路径下的pam_script_ses_open脚本并执行，在会话结束自动执行pam_script_ses_close脚本
```bash
root@uos-PC /e/pam.d# cat common-session
#
# /etc/pam.d/common-session - session-related modules common to all services
#
# This file is included from other service-specific PAM config files,
# and should contain a list of modules that define tasks to be performed
# at the start and end of sessions of *any* kind (both interactive and
# non-interactive).
#
# As of pam 1.0.1-6, this file is managed by pam-auth-update by default.
# To take advantage of this, it is recommended that you configure any
# local modules either before or after the default block, and use
# pam-auth-update to manage selection of other modules.  See
# pam-auth-update(8) for details.

# here are the per-package modules (the "Primary" block)
session [default=1]                     pam_permit.so
# here's the fallback if no module succeeds
session requisite                       pam_deny.so
# prime the stack with a positive return value if there isn't one already;
# this avoids us returning an error just because nothing sets a success code
# since the modules above will each just jump around
session required                        pam_permit.so
# and here are more per-package modules (the "Additional" block)
session required        pam_unix.so 
session required    		pam_udcp.so 
session optional        pam_systemd.so 
session optional        pam_mkhomedir.so umask=077

# 新增下面一行配置
session optional        pam_script.so
# end of pam-auth-update config
```

# 示例
您也可以libpam-script包中提供的 README.examples 文件，从而了解更多的信息。

常见的使用示例
```bash
# 会话开始后自动执行pam_script_ses_open脚本,结束后自动执行pam_script_ses_close脚本
session optional        pam_script.so  

# 用户名密码认证时自动执行pam_script_auth脚本
auth 		optional        pam_script.so

# 修改密码时自动执行pam_script_passwd脚本
passwd 	optional        pam_script.so

# 检查帐号属性时自动执行pam_script_acct脚本
account	optional        pam_script.so
```

# 场景拓展
1、ssh远程登录时，通过脚本在本地进行交互式提醒，避免被远程侵入
2、对session的open和close做记录，并集中时间统一上传，做大数据分析(用户许可的前提下)
# 示例脚本
```bash
#! /bin/sh
#
# An example pam-script, which can be used as a template for your own
#
# The accepted list of scripts:
#       pam_script_auth
#       pam_script_acct
#       pam_script_passwd
#       pam_script_ses_open
#       pam_script_ses_close
#
# The environment variables passed by pam-script onto the script
# (all will exist but some may be null if not applicable):
#       PAM_SERVICE     - the application that's invoking the PAM stack
#       PAM_TYPE        - the module-type (e.g. auth,account,session,password)
#       PAM_USER        - the user being authenticated into
#       PAM_RUSER       - the remote user, the user invoking the application
#       PAM_RHOST       - remote host
#       PAM_TTY         - the controlling tty
#       PAM_AUTHTOK     - password in readable text
#
# assume a GNU compatible date
stamp=`/bin/date +'%Y%m%d%H%M%S %a'`
# get the script name (could be link)
script=`basename $0`
#
LOGFILE=/tmp/pam-script.log
echo $stamp $script $PAM_SERVICE $PAM_TYPE                              \
        user=$PAM_USER ruser=$PAM_RUSER rhost=$PAM_RHOST                \
        tty=$PAM_TTY                                                    \
        args=["$@"]                                                     \
        >> $LOGFILE
chmod 666 $LOGFILE > /dev/null 2>&1

# success
exit 0
```

示例脚本输出如下：
```bash
[uos@uos-PC 11:04:40 ~]$ cat /tmp/pam-script.log 
20220913104655 二 pam_script_ses_open su session user=admin ruser=uos rhost= tty=pts/4 args=[]

```

# 注意事项
1、脚本的权限不能过高，否则会被pam_script拒绝执行(安全问题)，可以考虑将权限设置为755，报错信息可以查阅/var/log/auth.log文件。
```c
static int check_path_perms(const char *path) {

    struct stat fs;
    const mode_t ALL_EXEC_MASK = (S_IXUSR|S_IXGRP|S_IXOTH);

    /*
* note: checking security properties like this leaves us with a race
* condition, because the stat()/execve() execution is not atomic.
*
* likely candidates for overcoming this would have been fexecve() or
* execveat(). But both suffer from a side effect (at least on
* Linux/glibc implementation) that causes scripts to be called like
*
* "bash /proc/self/fd/<num> <argv1> ..."
*
* This would break existing scripts that can't make out their
* basename/dirname any more to base decisions on them.
*
* An explicit environment variable could be added that carries the
* "real" basename but that would complicate things even more.
*/

    /* test for script existence first */
    if (stat(path, &fs) < 0) {
        /* stat failure */
        pam_script_syslog(LOG_ERR,"can not stat %s", path);
        return 1;
    }

    if ((fs.st_mode & ALL_EXEC_MASK) != ALL_EXEC_MASK) {
        /* script not executable at all levels */
        pam_script_syslog(LOG_ALERT,
                          "path %s not fully executable", path);
        return 1;
    }
    else if ((fs.st_mode & S_IWOTH) != 0) {
        /* script is world writeable, probably not a good idea */
        pam_script_syslog(LOG_ALERT,
                          "path %s is world-writeable, rejecting for "
                          "security reasons", path);
        return 1;
    }
    else if (fs.st_uid != 0 || fs.st_gid != 0) {
        /* script should be owned by root:root */
        pam_script_syslog(LOG_ALERT,
                          "path %s is not owned by root:root, rejecting for security reasons", path);
        return 1;
    }

    return 0;
}
```

# 源码赏析
```c
/*
 *  Written by Jeroen Nijhof <jeroen@jeroennijhof.nl> 2005/03/01
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program - see the file COPYING.
 */

/* --- includes --- */
#include <stdio.h>
#include <stdarg.h>			/* varg... */
#include <string.h>			/* strcmp,strncpy,... */
#include <sys/types.h>			/* stat, fork, wait */
#include <sys/stat.h>			/* stat */
#include <sys/wait.h>			/* wait */
#include <unistd.h>			/* stat, fork, execve, **environ */
#include <stdlib.h>			/* calloc, setenv, putenv */

/* enable these module-types */
#define PAM_SM_AUTH
#define PAM_SM_ACCOUNT
#define PAM_SM_SESSION
#define PAM_SM_PASSWORD

#include <security/pam_appl.h>		/* pam_* */
#include <security/pam_modules.h>
#ifdef HAVE_CONFIG_H
#  include "config.h"
#endif
#if HAVE_VSYSLOG
#  include <syslog.h>			/* vsyslog */
#endif

/* --- customize these defines --- */

#ifndef PAM_SCRIPT_DIR
#  define PAM_SCRIPT_DIR	"/usr/bin"
#endif
#define PAM_SCRIPT_AUTH		"pam_script_auth"
#define PAM_SCRIPT_ACCT		"pam_script_acct"
#define PAM_SCRIPT_PASSWD	"pam_script_passwd"
#define PAM_SCRIPT_SES_OPEN	"pam_script_ses_open"
#define PAM_SCRIPT_SES_CLOSE	"pam_script_ses_close"

/* --- defines --- */

#define PAM_EXTERN	extern
#define BUFSIZE	128
#define DEFAULT_USER "nobody"

/* --- macros --- */
#define PAM_SCRIPT_SETENV(key)						\
	{if (pam_get_item(pamh, key, &envval) == PAM_SUCCESS)		\
		pam_script_setenv(#key, (const char *) envval);		\
	else	pam_script_setenv(#key, (const char *) NULL);}

/* external variables */
extern char **environ;

#if 0
/* convenient function to throw into one of the methods below
 * for setting as a breakpoint for debugging purposes.
 */
void pam_script_xxx(void) {
	int i = 1;
}
#endif

/* internal helper functions */

static void pam_script_syslog(int priority, const char *format, ...) {
	va_list args;
	va_start(args, format);

#if HAVE_VSYSLOG
	openlog(PACKAGE, LOG_CONS|LOG_PID, LOG_AUTH);
	vsyslog(priority, format, args);
	closelog();
#else
	vfprintf(stderr, format, args);
#endif
}

static void pam_script_setenv(const char *key, const char *value) {
#if HAVE_SETENV
	setenv(key, (value?value:""), 1);
#elif HAVE_PUTENV
	char	 buffer[BUFSIZE],
		*str;
	if (snprintf(buffer, BUFSIZE, "%s=%s", key, value ? value : "") > BUFSIZE) {
		// insufficient space
		return;
	}
	if ((str = strdup(buffer)) != NULL) {
		putenv(str);
	} /* else {
	     untrapped memory error - just do not add to environment
	} */
#else
#  error Can not set the environment
#endif
}

static int pam_script_get_user(pam_handle_t *pamh, const char **user) {
	int retval;

	retval = pam_get_user(pamh, user, NULL);
	if (retval != PAM_SUCCESS) {
		pam_script_syslog(LOG_ALERT, "pam_get_user returned error: %s",
			pam_strerror(pamh,retval));
		return retval;
	}
	if (*user == NULL || **user == '\0') {
		pam_script_syslog(LOG_ALERT, "username not known");
		retval = pam_set_item(pamh, PAM_USER,
			(const void *) DEFAULT_USER);
		if (retval != PAM_SUCCESS)
		return PAM_USER_UNKNOWN;
	}
	return retval;
}

static int check_path_perms(const char *path) {

	struct stat fs;
	const mode_t ALL_EXEC_MASK = (S_IXUSR|S_IXGRP|S_IXOTH);

	/*
	 * note: checking security properties like this leaves us with a race
	 * condition, because the stat()/execve() execution is not atomic.
	 *
	 * likely candidates for overcoming this would have been fexecve() or
	 * execveat(). But both suffer from a side effect (at least on
	 * Linux/glibc implementation) that causes scripts to be called like
	 *
	 * "bash /proc/self/fd/<num> <argv1> ..."
	 *
	 * This would break existing scripts that can't make out their
	 * basename/dirname any more to base decisions on them.
	 *
	 * An explicit environment variable could be added that carries the
	 * "real" basename but that would complicate things even more.
	 */

	/* test for script existence first */
	if (stat(path, &fs) < 0) {
		/* stat failure */
		pam_script_syslog(LOG_ERR,"can not stat %s", path);
		return 1;
	}

	if ((fs.st_mode & ALL_EXEC_MASK) != ALL_EXEC_MASK) {
		/* script not executable at all levels */
		pam_script_syslog(LOG_ALERT,
			"path %s not fully executable", path);
		return 1;
	}
	else if ((fs.st_mode & S_IWOTH) != 0) {
		/* script is world writeable, probably not a good idea */
		pam_script_syslog(LOG_ALERT,
				"path %s is world-writeable, rejecting for "
				"security reasons", path);
		return 1;
	}
	else if (fs.st_uid != 0 || fs.st_gid != 0) {
		/* script should be owned by root:root */
		pam_script_syslog(LOG_ALERT,
				"path %s is not owned by root:root, rejecting for security reasons", path);
		return 1;
	}

	return 0;
}

static int pam_script_exec(pam_handle_t *pamh,
	const char *type, const char *script, const char *user,
	int rv, int argc, const char **argv) {

	int	retval = rv,
		status,
		i;
	char	cmd[BUFSIZE] = { '\0' };
	char	**newargv;
	const void *envval = NULL;
	pid_t	child_pid = 0;

	/* check for pam.conf options */
	for (i = 0; i < argc; i++) {
		if (strncmp(argv[i],"onerr=",6) == 0) {
			if (strcmp(argv[i],"onerr=fail") == 0)
				retval = rv;
			else if (strcmp(argv[i],"onerr=success") == 0)
				retval = PAM_SUCCESS;
			else
				pam_script_syslog(LOG_ERR,
					"invalid option: %s", argv[i]);
		}
		if (strncmp(argv[i],"dir=",4) == 0) {
			const char *new_dir = argv[i] + 4;
			const int MAX_DIR_LEN = BUFSIZE - 2;

			if (*new_dir) { /* got new scriptdir */
				if (snprintf(cmd, MAX_DIR_LEN, "%s", new_dir) > MAX_DIR_LEN) {
					pam_script_syslog(LOG_ERR,"script dir %s exceeds maximum supported path length", new_dir);
					cmd[0] = '\0';
				}
			}
		}
	}

	if (cmd[0] == '\0') {
		strncpy(cmd, PAM_SCRIPT_DIR, BUFSIZE - 1);
	}

	/* strip trailing '/' */
	while (1) {
		size_t curlen = strlen(cmd);

		if (curlen == 0 || cmd[curlen-1] != '/')
			break;

		cmd[curlen - 1] = '\0';
	}

	/* check the base directory permissions */
	if (check_path_perms(cmd) != 0)
		return retval;

	strcat(cmd,"/");

	if (strlen(script) > (BUFSIZE - strlen(cmd) - 1)) {
		pam_script_syslog(LOG_ERR,"script path %s/%s exceeds maximum supported path length", cmd, script);
		return retval;
	}
	strncat(cmd,script,BUFSIZE-strlen(cmd)-1);

	/* check the script permissions */
	if (check_path_perms(cmd) != 0)
		return retval;

	/* Execute external program */
	/* fork process */
	switch(child_pid = fork()) {
	case -1:				/* fork failure */
		pam_script_syslog(LOG_ALERT,
			"script %s fork failure", cmd);
		return retval;
	case  0:				/* child */
		/* Get PAM environment, pass it onto the child's environment */
		PAM_SCRIPT_SETENV(PAM_SERVICE);
		pam_script_setenv("PAM_TYPE", type);
		pam_script_setenv("PAM_USER", user);
		PAM_SCRIPT_SETENV(PAM_RUSER);
		PAM_SCRIPT_SETENV(PAM_RHOST);
		PAM_SCRIPT_SETENV(PAM_TTY);
		PAM_SCRIPT_SETENV(PAM_AUTHTOK);
		PAM_SCRIPT_SETENV(PAM_OLDAUTHTOK);

		/* construct newargv */
		if (!(newargv = (char **) calloc(sizeof(char *), argc+2))) {
			// for rationale see below
			_exit(127);
		}
		newargv[0] = cmd;
		for (i = 0; i < argc; i++) {
			newargv[1+i] = (char *) argv[i];
		}
		(void) execve(cmd, newargv, environ);
		/* shouldn't get here, unless an error */
		pam_script_syslog(LOG_ALERT,
			"script %s exec failure", cmd);
		/*
		 * explicitly exit() here to avoid continuing execution of the
		 * PAM stack in the forked process in an undefined manner.
		 *
		 * 127 is typically the exit code when something fundamentally
		 * went wrong with starting a child process.
		 *
		 * use _exit() instead of exit() to avoid execution of any
		 * cleanup code like atexit() handlers.
		 */
		_exit(127);
		return retval;

	default:				/* parent */
		(void) waitpid(child_pid, &status, 0);
		if (WIFEXITED(status))
			return (WEXITSTATUS(status) ? rv : PAM_SUCCESS);
		else
			return retval;
	}
	return PAM_SUCCESS;
}

static int pam_script_converse(pam_handle_t *pamh, int argc,
	struct pam_message **message, struct pam_response **response)
{
	int retval;
	struct pam_conv *conv;

	retval = pam_get_item(pamh, PAM_CONV, (const void **)(void *) &conv);
	if (retval == PAM_SUCCESS) {
		retval = conv->conv(argc, (const struct pam_message **) message,
				response, conv->appdata_ptr);
	}
	return retval;
}

static int pam_script_set_authtok(pam_handle_t *pamh, int flags,
	int argc, const char **argv, char *prompt, int authtok)
{
	int	retval;
	char	*password;

	struct pam_message msg[1],*pmsg[1];
	struct pam_response *response;

	/* set up conversation call */
	pmsg[0] = &msg[0];
	msg[0].msg_style = PAM_PROMPT_ECHO_OFF;
	msg[0].msg = prompt;
	response = NULL;

	if ((retval = pam_script_converse(pamh, 1, pmsg, &response)) != PAM_SUCCESS)
		return retval;

	if (response) {
		if ((flags & PAM_DISALLOW_NULL_AUTHTOK) && response[0].resp == NULL) {
			free(response);
			return PAM_AUTH_ERR;
		}
		password = response[0].resp;
	  	response[0].resp = NULL;
	}
	else
		return PAM_CONV_ERR;

	free(response);
	pam_set_item(pamh, authtok, password);
	return PAM_SUCCESS;
}

static int pam_script_senderr(pam_handle_t *pamh, int flags,
	int argc, const char **argv, char *message)
{
	int retval;
	struct pam_message msg[1],*pmsg[1];
	struct pam_response *response;

	/* set up conversation call */
	pmsg[0] = &msg[0];
	msg[0].msg_style = PAM_ERROR_MSG;
	msg[0].msg = message;
	response = NULL;

	if ((retval = pam_script_converse(pamh, 1, pmsg, &response)) != PAM_SUCCESS)
		return retval;

	free(response);
	return PAM_SUCCESS;
}


/* --- authentication management functions --- */

PAM_EXTERN
int pam_sm_authenticate(pam_handle_t *pamh, int flags, int argc,
			const char **argv)
{
	int retval;
	const char *user=NULL;
	char *password;

	if ((retval = pam_script_get_user(pamh, &user)) != PAM_SUCCESS)
		return retval;

	/*
	* Check if PAM_AUTHTOK is set by early pam modules and
	* if not ask user for password.
	*/
	pam_get_item(pamh, PAM_AUTHTOK, (void*) &password);

	if (!password) {
		retval = pam_script_set_authtok(pamh, flags, argc, argv, "Password: ", PAM_AUTHTOK);
		if (retval != PAM_SUCCESS)
			return retval;
	}

	return pam_script_exec(pamh, "auth", PAM_SCRIPT_AUTH,
		user, PAM_AUTH_ERR, argc, argv);
}

PAM_EXTERN
int pam_sm_setcred(pam_handle_t *pamh, int flags, int argc,
		   const char **argv)
{
	return PAM_SUCCESS;
}

/* --- account management functions --- */

PAM_EXTERN
int pam_sm_acct_mgmt(pam_handle_t *pamh, int flags, int argc,
		     const char **argv)
{
	int retval;
	const char *user=NULL;

	if ((retval = pam_script_get_user(pamh, &user)) != PAM_SUCCESS)
		return retval;

	return pam_script_exec(pamh, "account", PAM_SCRIPT_ACCT,
		user,PAM_AUTH_ERR,argc,argv);
}

/* --- password management --- */

/*
 * instead of memset for clearing memory, hopefully not being optimized out
 * by the compiler
 */
static void safe_clearmem(char *mem, size_t size) {
	size_t i;
	for (i = 0; i < size; i++) {
		mem[i] = 0;
	}
}

PAM_EXTERN
int pam_sm_chauthtok(pam_handle_t *pamh, int flags, int argc,
		     const char **argv)
{
	int retval;
	const char *user = NULL;
	char *password = NULL;
        char new_pass1[BUFSIZE];
        char new_pass2[BUFSIZE];

	if ((retval = pam_script_get_user(pamh, &user)) != PAM_SUCCESS)
		return retval;

	if ( flags & PAM_UPDATE_AUTHTOK ) {
		/*
		 * Check if PAM_OLDAUTHTOK is set by early pam modules and
		 * if not ask user (not root) for current password.
		 */
		pam_get_item(pamh, PAM_OLDAUTHTOK, (void*) &password);
		if (!password && strcmp(user, "root") != 0) {
			retval = pam_script_set_authtok(pamh, flags, argc, argv, "Current password: ", PAM_OLDAUTHTOK);
			if (retval != PAM_SUCCESS)
				return retval;
			pam_get_item(pamh, PAM_OLDAUTHTOK, (void*) &password);
		}

		/*
		 * Check if PAM_AUTHTOK is set by early pam modules and
		 * if not ask user for the new password.
		 */
		pam_get_item(pamh, PAM_AUTHTOK, (void*) &password);
		if (!password) {
			retval = pam_script_set_authtok(pamh, flags, argc, argv, "New password: ", PAM_AUTHTOK);
			if (retval != PAM_SUCCESS)
				return retval;
			pam_get_item(pamh, PAM_AUTHTOK, (void*) &password);
			snprintf(new_pass1, BUFSIZE, "%s", password);
			password = NULL;

			retval = pam_script_set_authtok(pamh, flags, argc, argv, "New password (again): ", PAM_AUTHTOK);
			if (retval != PAM_SUCCESS) {
				safe_clearmem(new_pass1, sizeof(new_pass1));
				return retval;
			}
			retval = pam_get_item(pamh, PAM_AUTHTOK, (void*) &password);
			snprintf(new_pass2, BUFSIZE, "%s", password);
			password = NULL;

			/* Check if new passwords are the same */
			if (strcmp(new_pass1, new_pass2) != 0) {
				retval = pam_script_senderr(pamh, flags, argc, argv,
						"You must enter the same password twice.");

				if (retval == PAM_SUCCESS)
					retval = PAM_AUTHTOK_ERR;
			}

			safe_clearmem(new_pass1, sizeof(new_pass1));
			safe_clearmem(new_pass2, sizeof(new_pass2));

			if (retval != PAM_SUCCESS)
				return PAM_AUTHTOK_ERR;
		}
		return pam_script_exec(pamh, "password", PAM_SCRIPT_PASSWD,
			user, PAM_AUTHTOK_ERR, argc, argv);
	}
	return PAM_SUCCESS;
}

/* --- session management --- */

PAM_EXTERN
int pam_sm_open_session(pam_handle_t *pamh, int flags, int argc,
			const char **argv)
{
	int retval;
	const char *user = NULL;

	if ((retval = pam_script_get_user(pamh, &user)) != PAM_SUCCESS)
		return retval;

	return pam_script_exec(pamh, "session", PAM_SCRIPT_SES_OPEN,
		user, PAM_SESSION_ERR, argc, argv);
}

PAM_EXTERN
int pam_sm_close_session(pam_handle_t *pamh, int flags, int argc,
			 const char **argv)
{
	int retval;
	const char *user = NULL;

	if ((retval = pam_script_get_user(pamh, &user)) != PAM_SUCCESS)
		return retval;

	return pam_script_exec(pamh, "session", PAM_SCRIPT_SES_CLOSE,
		user, PAM_SESSION_ERR, argc, argv);
}

/* end of module definition */

#ifdef PAM_STATIC

/* static module data */

struct pam_module _pam_script_modstruct = {
	"pam_script",
	pam_sm_authenticate,
	pam_sm_setcred,
	pam_sm_acct_mgmt,
	pam_sm_open_session,
	pam_sm_close_session,
	pam_sm_chauthtok
};

#endif

```

# 附录
> 本文资料为以下链接的总结，可能大量借鉴其中内容，因此不敢说原创，仅做分享之用，如有侵权，告知必删。

[pam_script - Linux man page](https://linux.die.net/man/5/pam_script)---部分信息已经过时了，以本文内容为准

[https://github.com/jeroennijhof/pam_script](https://github.com/jeroennijhof/pam_script)---Homepage

[https://linux.die.net/man/8/pam_exec](https://linux.die.net/man/8/pam_exec)---pam_exec(当我看完了pam_script，发现了pam_exec,emmm...)

